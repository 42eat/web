mod auth;
mod health_check;

use axum::{Router, routing::get};

use crate::app_state::AppState;

#[tracing::instrument]
pub fn router() -> axum::Router<AppState> {
    Router::new()
        .route("/health-check", get(health_check::get))
        .nest("/auth", auth::router())
}
