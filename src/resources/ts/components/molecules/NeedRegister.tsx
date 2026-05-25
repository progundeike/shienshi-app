import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

export const NeedRegister: FC = memo(() => {
    return (
        <>
            <Box mb={2}>
                <Text>添削にはログインが必要です</Text>
            </Box>
            <Flex justifyContent="center" gap={5}>
                <Button
                    as={Link}
                    to="/login"
                    backgroundColor={"baseColor"}
                    color={"baseTextColor"}
                    borderRadius="full"
                >
                    ログイン
                </Button>

                <Button
                    as={Link}
                    to="/register"
                    backgroundColor={"accentColor"}
                    color={"accentTextColor"}
                    borderRadius="full"
                >
                    ユーザー登録
                </Button>
            </Flex>
        </>
    );
});
