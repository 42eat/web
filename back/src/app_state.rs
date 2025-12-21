use crate::config::{Config, OAuth42Config};

#[derive(Clone, derive_getters::Getters)]
pub struct AppState {
    oauth_42_config: OAuth42Config,
}

impl AppState {
    pub fn new(config: Config) -> Self {
        Self {
            oauth_42_config: config.oauth_42_config().clone(),
        }
    }
}

impl std::fmt::Debug for AppState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        // We don't include the data to avoid overloading the logs
        f.debug_struct("AppState").finish()
    }
}
