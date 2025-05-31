import "../css/app.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "./components/theme/theme";
import { Router } from "./components/Router";
import { useAuth } from "./hooks/useAuth";

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </ChakraProvider>
    );
};
