/// GET /health-check
///
/// Returns:
/// "OK"
#[tracing::instrument]
pub async fn get() -> &'static str {
    "OK"
}
