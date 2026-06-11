import { Box, Flex } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

export const TopPageFooter: FC = memo(() => {
    return (
        <Flex
            as="footer"
            w="100%"
            p={1}
            backgroundColor="#EDEFF4"
            direction="column"
            justify="center"
            align="center"
            color="footerTextColor"
            fontSize={{ base: "sm", md: "md" }}
        >
            <Flex direction="column" align="center" gap={{ base: 1, md: 3 }}>
                <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 1, md: 20 }}
                    justify="center"
                    textAlign="center"
                >
                    <Link to="/privacy">プライバシーポリシー</Link>
                    <Link to="/terms">利用規約</Link>
                    <Link to="/contact">お問い合わせ</Link>
                </Flex>
                <Box textAlign="center">© 2026 支援士対策室</Box>
            </Flex>
        </Flex>
    );
});
