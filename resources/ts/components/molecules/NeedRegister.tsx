import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

export const NeedRegister: FC = memo(() => {
    return (
        <>
            <Box mb="10px">
                <Text>答え合わせにはログインが必要です</Text>
            </Box>
            <Flex justifyContent="center" gap="20px">
                <Link to="/login">
                    <Button backgroundColor="green.200">ログイン</Button>
                </Link>
                <Link to="/register">
                    <Button backgroundColor="blue.200">ユーザー登録</Button>
                </Link>
            </Flex>
        </>
    );
});
