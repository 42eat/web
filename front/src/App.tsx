import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { AppRouter } from "./routes";
import { I18nProvider } from "./i18n/context";

const client = new QueryClient();

const App: Component = () => {
	return <I18nProvider>
		<QueryClientProvider client={client}>
			<AppRouter />
		</QueryClientProvider>
	</I18nProvider>;
};

export default App;
