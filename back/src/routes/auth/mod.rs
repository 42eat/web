use crate::AppState;

mod ft;

#[tracing::instrument]
pub fn router() -> axum::Router<AppState> {
    axum::Router::new().nest("/42", ft::router())
}
