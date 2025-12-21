//! OAuth2 authentication routes for 42 API.

mod callback;
mod login;

use crate::app_state::AppState;

use axum::Router;

#[tracing::instrument]
pub fn router() -> axum::Router<AppState> {
    Router::new()
        .route("/login", axum::routing::get(login::get))
        .route("/callback", axum::routing::get(callback::get))
}
