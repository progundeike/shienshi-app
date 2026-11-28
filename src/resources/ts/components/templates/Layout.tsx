import { Box, Divider, Flex } from "@chakra-ui/react";
import { memo, FC } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { matchPath, useLocation } from "react-router-dom";
import { TopPageFooter } from "./TopPageFooter";

type Props = {
    children: React.ReactNode;
};

export const Layout: FC<Props> = memo(({ children }) => {
    const location = useLocation();
    const isTopPage = location.pathname === "/";

    if (matchPath("/exams/:year/:season/:section/pdf-window", location.pathname)) {
        return <>{children}</>;
    }

    return (
        <Flex direction="column" minH="100vh" overflow="hidden">
            <Header />
            <Box flex="1">{children}</Box>
            {!isTopPage ? <Footer /> : <TopPageFooter />}
        </Flex>
    );
});
