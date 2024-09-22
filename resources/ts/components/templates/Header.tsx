import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";
import { GrCircleInformation } from "react-icons/gr";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";

export const Header: FC = memo(() => {
    const user = useAtomValue(userAtom);
    const iconSize = "30px";
    const fontSize = "14px";

    return (
        <Box backgroundColor="white">
            <Box w="90%" m="auto" p="20px">
                <Flex
                    justifyContent="space-between"
                    wrap="wrap"
                    alignItems="center"
                >
                    {/* 左バナー */}
                    <Link to="/">
                        <Heading
                            as="h1"
                            size="md"
                            fontSize="30px"
                            fontWeight="400"
                            textShadow="1px 1px 1px gray"
                        >
                            情報処理安全確保支援士 午後対策
                        </Heading>
                    </Link>

                    {/* 右メニュー */}
                    {/* {isMobileView ? <MobileMenu /> : <PcMenu />} */}
                    <Flex gap="20px">
                        <Link to="/about">
                            <VStack spacing="0">
                                <Icon
                                    as={GrCircleInformation}
                                    fontSize={iconSize}
                                    m="0"
                                />
                                <Text fontSize={fontSize}>ABOUT</Text>
                            </VStack>
                        </Link>
                        <Link to="/exams/2023/aki/1">exam</Link>
                        <Link to="/exams_list">試験一覧</Link>

                        {user ? (
                            <Link to="/my-page">
                                <VStack spacing="0">
                                    <Icon
                                        as={FaUserCircle}
                                        fontSize={iconSize}
                                        m="0"
                                    />
                                    <Text fontSize={fontSize}>MyPage</Text>
                                </VStack>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <VStack spacing="0">
                                        <Icon
                                            as={AiOutlineUser}
                                            fontSize={iconSize}
                                        />
                                        <Text fontSize={fontSize}>
                                            ログイン
                                        </Text>
                                    </VStack>
                                </Link>

                                {/* <Link to="/register">ユーザー登録</Link> */}
                            </>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
