import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext.tsx";
import CustomErrorBoundary from "./components/CustomErrorBoundary.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// React query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CustomErrorBoundary>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<App />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</AuthProvider>
		</CustomErrorBoundary>
	</StrictMode>
);
