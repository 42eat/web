mod app_state;
use app_state::AppState;

mod config;
use config::*;

mod routes;

mod logger;
use logger::Logger;

use axum::Router;
use tower_http::trace::{DefaultMakeSpan, DefaultOnRequest, DefaultOnResponse, TraceLayer};
use tracing::{Level, info};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to load .env file");

    // Need to keep the var. If we drop it, the logs will stop working.
    let _logger = Logger::new();

    let (listener, app) = {
        let config = Config::load();

        let listener = tokio::net::TcpListener::bind(config.bind_url())
            .await
            .unwrap_or_else(|err| panic!("Failed to bind to address {}: {err}", config.bind_url()));

        info!("Listening on url: {}", config.bind_url());

        let app_state = AppState::new(config);

        info!("Starting web server");

        let app = Router::new()
            .layer(
                TraceLayer::new_for_http()
                    .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
                    .on_request(DefaultOnRequest::new().level(Level::INFO))
                    .on_response(DefaultOnResponse::new().level(Level::INFO)),
            )
            .with_state(app_state);

        (listener, app)
    };

    axum::serve(listener, app).await.expect("Server crashed");
}
