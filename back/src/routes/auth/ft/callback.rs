use axum::{
    extract::{Query, State},
    response::Redirect,
};
use oauth2::{AuthorizationCode, TokenResponse};
use tracing::{debug, error, info, warn};

use crate::{Session, app_state::AppState, config::OAuth42Config};

#[derive(serde::Deserialize)]
#[serde(untagged)]
pub enum CallbackQuery {
    Success(SuccessQuery),
    Error(ErrorQuery),
}

#[derive(serde::Deserialize)]
pub struct SuccessQuery {
    code: String,
    state: String,
}

#[derive(serde::Deserialize)]
pub struct ErrorQuery {
    error: String,
    error_description: Option<String>,
}

#[derive(serde::Serialize)]
struct ErrorRedirectQuery {
    error: String,
}

/// User data structure returned by 42 API.
// TODO remove allow dead_code once JWT are implemented
#[allow(dead_code)]
#[derive(serde::Deserialize)]
struct User42Data {
    id: i32,
    email: String,
    login: String,
}

/// GET /auth/42/callback
///
/// Success Response:
/// - redirects to the home page.
///
/// Errors:
/// - redirects to /error with the query string error=String
#[tracing::instrument(skip(query))]
pub async fn get(
    Query(query): Query<CallbackQuery>,
    State(state): State<AppState>,
    session: Session,
) -> Result<Redirect, Redirect> {
    let success_query = get_success_query(query)?;

    validate_csrf_token(success_query.state, &session, state.oauth_42_config())?;

    let token = fetch_42_api_access_token(success_query.code, state.oauth_42_config()).await?;
    let user_data_42 = fetch_user_data_from_42_api(&token).await?;

    info!(
        user_id = user_data_42.id,
        user_login = %user_data_42.login,
        "User successfully authenticated via 42 OAuth. Redirecting user to \"/\""
    );

    Ok(Redirect::to("/"))
}

#[tracing::instrument(skip_all)]
fn get_success_query(query: CallbackQuery) -> Result<SuccessQuery, Redirect> {
    match query {
        CallbackQuery::Success(success_query) => Ok(success_query),
        CallbackQuery::Error(ErrorQuery {
            error,
            error_description,
        }) => {
            let description = error_description.unwrap_or_default();
            warn!(error = %error, description = %description, "OAuth2 provider returned an error");
            Err(create_error_redirect(
                "42 OAuth2 returned an error. Did you refuse the connection?",
            ))
        }
    }
}

#[tracing::instrument(skip_all)]
fn create_error_redirect(error_msg: impl Into<String>) -> Redirect {
    let query = ErrorRedirectQuery {
        error: error_msg.into(),
    };

    let query_string = serde_urlencoded::to_string(query)
        .expect("Failed to serialize ErrorRedirectQuery to query string");

    let path = format!("/error?{query_string}");

    info!("Redirecting to: {path}");

    Redirect::to(&path)
}

#[tracing::instrument]
fn validate_csrf_token(
    received_token: String,
    session: &Session,
    oauth_42_config: &crate::config::OAuth42Config,
) -> Result<(), Redirect> {
    debug!("Validating CSRF token");
    let stored_token = session
        .pop_oauth_42_csrf_token(oauth_42_config)
        .ok_or_else(|| {
            warn!("CSRF token not found in session, may have expired");
            create_error_redirect("CSRF token not found in session, may have expired")
        })?;

    if *stored_token.secret() != received_token {
        warn!("CSRF token mismatch detected");
        return Err(create_error_redirect("CSRF Token mismatch detected"));
    }

    debug!("CSRF token validated successfully");

    Ok(())
}

#[tracing::instrument(skip_all)]
async fn fetch_42_api_access_token(
    exchange_code: String,
    oauth_42_config: &OAuth42Config,
) -> Result<String, Redirect> {
    debug!("Exchanging authorization code for access token");
    oauth_42_config
        .client()
        .exchange_code(AuthorizationCode::new(exchange_code))
        .request_async(&oauth2::reqwest::Client::new())
        .await
        .map(|token| {
            debug!("Successfully obtained access token");
            token.access_token().secret().clone()
        })
        .map_err(|err| {
            error!(
                error = ?err,
                "Failed to exchange authorization code for access token"
            );
            create_error_redirect("Failed to exchange authorization code for access token")
        })
}

#[tracing::instrument(skip_all)]
async fn fetch_user_data_from_42_api(token: &str) -> Result<User42Data, Redirect> {
    debug!("Fetching user data from 42 API");
    let response = reqwest::Client::new()
        .get("https://api.intra.42.fr/v2/me")
        .bearer_auth(token)
        .send()
        .await
        .map_err(|err| {
            error!(
                error = ?err,
                "Failed to send user data request to OAuth2 provider"
            );
            create_error_redirect("Failed to send user data request to OAuth2 provider")
        })?;

    debug!("Parsing user data response from 42 API");
    response.json::<User42Data>().await.map_err(|err| {
        error!(
            error = ?err,
            "Failed to parse user data returned by OAuth2 provider"
        );
        create_error_redirect("Failed to parse user data returned by OAuth2 provider")
    })
}
