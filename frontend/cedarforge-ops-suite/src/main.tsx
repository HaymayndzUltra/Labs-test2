import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App";
import { ThemeProvider } from "@shared/components/ThemeProvider";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <IntlProvider locale="en" messages={{}}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </IntlProvider>
  </StrictMode>
);
