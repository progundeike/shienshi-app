import { Box, Divider } from "@chakra-ui/react";
import { memo, FC } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
    children: React.ReactNode;
};

export const Layout: FC<Props> = memo(({ children }) => {
    return (
        <>
            <Header />
            <Box
                pt="70px"
                w={{ base: "100%", md: "98%" }}
                m="auto"
                maxW="1500px"
                minH="90vh"
            >
                {children}
            </Box>
            <Divider />
            <Footer />
        </>
    );
});
