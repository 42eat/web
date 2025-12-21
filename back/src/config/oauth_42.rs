use super::env_var;

use oauth2::{AuthUrl, ClientId, ClientSecret, EndpointNotSet, EndpointSet, RedirectUrl, TokenUrl};
use tower_cookies::Key;
use tracing::debug;

type BasicClient = oauth2::basic::BasicClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointSet,
>;

#[derive(derive_getters::Getters, Clone)]
pub struct OAuth42Config {
    client: BasicClient,
    state_cookie_signing_key: Key,
}

impl OAuth42Config {
    pub fn from_env() -> Self {
        debug!("Loading 42 OAuth config");

        Self {
            client: client_from_env(),
            state_cookie_signing_key: Key::try_from(
                env_var("OAUTH_42_STATE_COOKIE_SIGNING_KEY").as_bytes(),
            )
            .expect("Invalid OAUTH_42_STATE_COOKIE_SIGNING_KEY env var"),
        }
    }
}

fn client_from_env() -> BasicClient {
    let client_id = ClientId::new(env_var("OAUTH_42_CLIENT_ID"));

    let client_secret = ClientSecret::new(env_var("OAUTH_42_CLIENT_SECRET"));

    let auth_url =
        AuthUrl::new(env_var("OAUTH_42_AUTH_URL")).expect("Invalid OAUTH_42_AUTH_URL env var");

    let token_url =
        TokenUrl::new(env_var("OAUTH_42_TOKEN_URL")).expect("Invalid OAUTH_42_TOKEN_URL env var");

    let redirect_url = RedirectUrl::new(env_var("OAUTH_42_REDIRECT_URL"))
        .expect("Invalid OAUTH_42_REDIRECT_URL env var");

    oauth2::basic::BasicClient::new(client_id)
        .set_client_secret(client_secret)
        .set_auth_uri(auth_url)
        .set_token_uri(token_url)
        .set_redirect_uri(redirect_url)
}

impl std::fmt::Debug for OAuth42Config {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        // We don't include the data to avoid overloading the logs
        f.debug_struct("OAuth42Config").finish()
    }
}
