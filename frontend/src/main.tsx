import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext.tsx";
import CustomErrorBoundary from "./components/CustomErrorBoundary.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<App />
				</AuthProvider>
			</QueryClientProvider>
		</CustomErrorBoundary>
	</StrictMode>,
);

const splash = document.getElementById("splash");
if (splash) {
	splash.style.opacity = "0";
	setTimeout(() => splash.remove(), 500);
}
