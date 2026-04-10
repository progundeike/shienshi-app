import { Box, Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import React, { FC, memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { dateUtils } from "../../utils/dateUtils";

const HeaderButton: FC<{ children: React.ReactNode }> = memo(({ children }) => {
    return (
        <Button
            backgroundColor="baseColor"
            color="accentTextColor"
            borderRadius="full"
            p="20px"
        >
            {children}
        </Button>
    );
});

const HeaderLink: FC<{ children: React.ReactNode; to: string }> = memo(
    ({ children, to }) => {
        return (
            <Text
                as={RouterLink}
                to={to}
                fontWeight="bold"
                fontSize={{ base: "md", md: "lg" }}
                _hover={{ textDecoration: "underline" }}
                textUnderlineOffset="5px"
            >
                {children}
            </Text>
        );
    },
);

export const Header: FC = memo(() => {
    const user = useAtomValue(userAtom);

    // CBT方式への移行に伴い試験日表示は一旦非表示
    // const { daysUntilNextExam } = dateUtils();

    return (
        <Box
            as="header"
            bg="baseColor"
            color="baseTextColor"
            borderBottom="1px solid"
            borderColor="blackAlpha.200"
            position="sticky"
            top="0"
            zIndex="sticky"
        >
            <Box m="auto" py="5px" px={{ base: 4, md: 6 }}>
                <Flex
                    justifyContent="space-between"
                    wrap="wrap"
                    alignItems="center"
                >
                    {/* 左バナー */}
                    <RouterLink to="/">
                        <Flex direction="row" alignItems="center">
                            <Image
                                src="/images/top_icon.png"
                                alt="支援士対策室ロゴ"
                                h="60px"
                            />
                            <Box display={{ base: "none", md: "block" }}>
                                <Heading
                                    as="h1"
                                    size="md"
                                    fontSize={{ base: "32px", md: "36px" }}
                                    fontWeight="700"
                                    letterSpacing="0.02em"
                                >
                                    支援士対策室
                                </Heading>
                            </Box>
                        </Flex>
                    </RouterLink>
                    {/* <Box fontSize="20px">
                        試験まで残り{daysUntilNextExam()}日
                    </Box> */}

                    {/* 右メニュー */}
                    {/* {isMobileView ? <MobileMenu /> : <PcMenu />} */}
                    <Flex gap="30px" alignItems="center">
                        <HeaderLink to="/">ホーム</HeaderLink>
                        <HeaderLink to="/exams">過去問一覧</HeaderLink>
                        {/* <HeaderLink to="/about">ABOUT</HeaderLink> */}

                        {user ? (
                            <HeaderLink to="/my-page">MyPage</HeaderLink>
                        ) : (
                            <>
                                <Button
                                    as={RouterLink}
                                    to="/register"
                                    backgroundColor="#60A5FA"
                                    color="accentTextColor"
                                    _hover={{ bg: "#4F94F7" }}
                                    borderRadius="full"
                                    p="20px"
                                    textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                                >
                                    無料で始める
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to="/login"
                                    backgroundColor="white"
                                    color="baseColor"
                                    borderRadius="full"
                                    p="20px"
                                >
                                    ログイン
                                </Button>
                            </>
                        )}

                        {user?.isAdmin && (
                            <RouterLink to="/admin">管理ページ</RouterLink>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
