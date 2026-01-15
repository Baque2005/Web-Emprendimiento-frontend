import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AnimatedRoutes from "@/components/layout/AnimatedRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <ErrorBoundary>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
