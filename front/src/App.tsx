import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Show, type Component } from "solid-js";
import { AppRouter } from "./routes";
import { I18nProvider } from "./i18n/context";
import { initialized } from "./store/auth.store";
import LoadingSplash from "./pages/Loading/LoadingSplash";
import { ToasterProvider } from "./components/ui/Toaster/Toaster";

const client = new QueryClient();

const App: Component = () => {
	return <I18nProvider>
		<ToasterProvider>
			<Show when={initialized()} fallback={<LoadingSplash/>}>
				<QueryClientProvider client={client}>
					<AppRouter />
				</QueryClientProvider>
			</Show>
		</ToasterProvider>
	</I18nProvider>;
};

export default App;
