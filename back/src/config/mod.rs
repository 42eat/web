mod oauth_42;

pub use oauth_42::OAuth42Config;

#[derive(derive_getters::Getters)]
pub struct Config {
    bind_url: String,
    oauth_42_config: oauth_42::OAuth42Config,
}

impl Config {
    pub fn load() -> Self {
        Self {
            bind_url: env_var("BIND_URL"),
            oauth_42_config: OAuth42Config::from_env(),
        }
    }
}

fn env_var(key: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| panic!("Missing env variable: {}", key))
}
