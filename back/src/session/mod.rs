use axum::{extract::FromRequestParts, http::request::Parts};
use oauth2::CsrfToken;
use tower_cookies::{Cookie, Cookies};

use crate::config::OAuth42Config;

const IS_RELEASE_BUILD: bool = !cfg!(debug_assertions);

const OAUTH_42_CSRF_TOKEN_KEY: &str = "oauth_42_csrf_token";

pub struct Session(Cookies);

impl std::fmt::Debug for Session {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Session")
            // TODO Include the user id once JWT is implemented
            .field("User id", &"unknown")
            .finish()
    }
}

impl Session {
    pub fn set_oauth_42_csrf_token(&self, csrf_token: CsrfToken, oauth_42_config: &OAuth42Config) {
        let csrf_token_cookie = Cookie::build((OAUTH_42_CSRF_TOKEN_KEY, csrf_token.into_secret()))
            .same_site(tower_cookies::cookie::SameSite::Lax)
            .http_only(true)
            .secure(IS_RELEASE_BUILD)
            .max_age(tower_cookies::cookie::time::Duration::minutes(3))
            .path("/api/auth/42/")
            .build();

        self.0
            .signed(oauth_42_config.state_cookie_signing_key())
            .add(csrf_token_cookie);
    }

    pub fn pop_oauth_42_csrf_token(&self, oauth_42_config: &OAuth42Config) -> Option<CsrfToken> {
        let signed_cookies = self.0.signed(oauth_42_config.state_cookie_signing_key());

        let cookie_value = pop_signed_cookie(&signed_cookies, OAUTH_42_CSRF_TOKEN_KEY)?;
        Some(CsrfToken::new(cookie_value))
    }
}

fn pop_signed_cookie(
    signed_cookies: &tower_cookies::SignedCookies,
    key: &'static str,
) -> Option<String> {
    let cookie = signed_cookies.get(key)?.value().to_owned();
    signed_cookies.remove(Cookie::from(key));
    Some(cookie)
}

/// Extractor to get session from cookies.
///
/// # Example
/// ```rust
/// use crate::Session;
/// use axum::Router;
/// use tower_cookies::CookieManagerLayer;
///
/// let app = Router::new()
///     .route("/route", get(handler))
///     .layer(CookieManagerLayer::new());
///
/// async fn handler(session: Session) { }
/// ```
impl<S> FromRequestParts<S> for Session
where
    S: Send + Sync,
{
    type Rejection = <Cookies as FromRequestParts<S>>::Rejection;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        Cookies::from_request_parts(parts, state).await.map(Session)
    }
}
