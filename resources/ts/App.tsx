import "../css/app.css";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "./components/theme/theme";
import { Router } from "./components/Router";
import { RecoilRoot } from "recoil";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement!);

root.render(
    <StrictMode>
        <RecoilRoot>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Router />
                </BrowserRouter>
            </ChakraProvider>
        </RecoilRoot>
    </StrictMode>
);
