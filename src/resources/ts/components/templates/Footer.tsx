import { Flex } from "@chakra-ui/react";
import { FC, memo } from "react";

export const Footer: FC = memo(() => {
    return (
        <Flex
            as="footer"
            w="100%"
            h="30px"
            backgroundColor="#EDEFF4"
            justify="center"
            align="center"
            color="footerTextColor"
        >
            © 2026 支援士対策室
        </Flex>
    );
});
