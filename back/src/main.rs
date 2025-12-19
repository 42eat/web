mod app_state;
use app_state::AppState;

mod config;
use config::*;

mod routes;

use axum::Router;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to load .env file");

    let (listener, app) = {
        let config = Config::load();

        let listener = tokio::net::TcpListener::bind(config.bind_url())
            .await
            .unwrap_or_else(|err| panic!("Failed to bind to address {}: {err}", config.bind_url()));

        let app_state = AppState::new(config);

        let app = Router::new()
            .with_state(app_state);

        (listener, app)
    };

    axum::serve(listener, app).await.expect("Server crashed");
}
