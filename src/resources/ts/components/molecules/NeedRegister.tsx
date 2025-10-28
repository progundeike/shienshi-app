import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

export const NeedRegister: FC = memo(() => {
    return (
        <>
            <Box mb="10px">
                <Text>答え合わせをするためにはログインが必要です</Text>
            </Box>
            <Flex justifyContent="center" gap="20px">
                <Link to="/login">
                    <Button
                        backgroundColor={"baseColor"}
                        color={"baseTextColor"}
                    >
                        ログイン
                    </Button>
                </Link>
                <Link to="/register">
                    <Button
                        backgroundColor={"accentColor"}
                        color={"accentTextColor"}
                    >
                        ユーザー登録
                    </Button>
                </Link>
            </Flex>
        </>
    );
});
