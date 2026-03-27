import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import { AppRouter } from "./routes";

const client = new QueryClient();

const App: Component = () => {
	return <QueryClientProvider client={client}><AppRouter/></QueryClientProvider>;
};

export default App;
