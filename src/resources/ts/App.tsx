import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "./components/theme/theme";
import { Router } from "./components/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Router />
                </BrowserRouter>
            </ChakraProvider>
        </QueryClientProvider>
    );
};
