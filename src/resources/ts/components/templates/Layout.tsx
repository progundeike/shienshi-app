import { Box, Divider, Flex } from "@chakra-ui/react";
import { memo, FC } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
    children: React.ReactNode;
};

export const Layout: FC<Props> = memo(({ children }) => {
    return (
        <Flex direction="column" minH="100vh">
            <Header />
            <Box
                w={{ base: "100%", md: "98%" }}
                m="auto"
                maxW="1500px"
                minH="80vh"
            >
                {children}
            </Box>
            <Divider />
            <Footer />
        </Flex>
    );
});
