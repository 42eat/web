use std::io::Write;

use tracing_appender::{
    non_blocking::{NonBlocking, WorkerGuard},
    rolling,
};
use tracing_subscriber::{EnvFilter, Registry, fmt::Layer, layer::SubscriberExt};

pub struct Logger {
    #[allow(unused)]
    stdout_writer_guard: WorkerGuard,
    #[allow(unused)]
    json_file_writer_guard: WorkerGuard,
}

impl Logger {
    /// Initiates a logger that writes logs to both stdout and a json file at
    /// `./logs/log.YYYY_MM_DD`
    ///
    /// The logger will stop working if dropped
    #[tracing::instrument]
    pub fn new() -> Self {
        let (stdout_writer, stdout_writer_guard) = non_block_writer(std::io::stdout());
        let stdout_layer = Layer::default()
            .pretty()
            .with_writer(stdout_writer)
            .with_level(true)
            .with_target(false)
            .with_ansi(true);

        let (json_file_writer, json_file_writer_guard) =
            non_block_writer(rolling::daily("./logs", "log"));
        let json_file_logger = Layer::default()
            .with_level(true)
            .with_target(false)
            .with_ansi(false)
            .with_writer(json_file_writer)
            .json();

        let subscriber = Registry::default()
            .with(stdout_layer)
            .with(json_file_logger)
            .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")));

        tracing::subscriber::set_global_default(subscriber)
            .expect("unable to set global subscriber");

        tracing::info!("Logger was created");

        Self {
            stdout_writer_guard,
            json_file_writer_guard,
        }
    }
}

fn non_block_writer<T: Write + Send + 'static>(file: T) -> (NonBlocking, WorkerGuard) {
    tracing_appender::non_blocking::NonBlockingBuilder::default()
        // When the buffer is full, we will wait for it to have space rather than discard the logs
        .lossy(false)
        .finish(file)
}
