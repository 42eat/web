use axum::{extract::State, response::Redirect};
use oauth2::{CsrfToken, Scope};
use tracing::info;

use crate::{Session, app_state::AppState};

/// GET /auth/42/login
///
/// Redirects the user to the 42 OAuth2 authorization URL.
#[tracing::instrument]
pub async fn get(State(state): State<AppState>, session: Session) -> Redirect {
    let (url, csrf_token) = state
        .oauth_42_config()
        .client()
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("public".to_owned()))
        .url();

    session.set_oauth_42_csrf_token(csrf_token, state.oauth_42_config());

    info!("Redirecting user to {url}");
    Redirect::to(url.as_str())
}
