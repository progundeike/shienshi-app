import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    IconButton,
    MenuList,
} from "@chakra-ui/react";
import React, { FC, memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAtomValue } from "jotai";
import { HamburgerIcon } from "@chakra-ui/icons";

import { userAtom } from "../../states/userAtom";

const MobileMenuItem: FC<{ text: string; to: string }> = memo(
    ({ text, to }) => {
        return (
            <MenuItem as={RouterLink} to={to} _hover={{ bg: "gray.100" }}>
                {text}
            </MenuItem>
        );
    },
);

const HeaderLink: FC<{ children: React.ReactNode; to: string }> = memo(
    ({ children, to }) => {
        return (
            <Text
                as={RouterLink}
                to={to}
                fontWeight="bold"
                fontSize="lg"
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
            <Box m="auto" px={{ base: 1, md: 6 }}>
                <Flex
                    justifyContent="space-between"
                    wrap="nowrap"
                    alignItems="center"
                >
                    {/* 左バナー */}
                    <RouterLink to="/">
                        <Flex direction="row" alignItems="center">
                            <Image
                                src="/images/top_icon.png"
                                alt="支援士対策室ロゴ"
                                h={{ base: "36px", md: "60px" }}
                            />
                            <Box>
                                <Heading
                                    as="h1"
                                    size="md"
                                    fontSize={{ base: "18px", md: "30px" }}
                                    fontWeight="700"
                                    letterSpacing="0.02em"
                                >
                                    支援士対策室
                                </Heading>
                            </Box>
                        </Flex>
                    </RouterLink>

                    {/* PC右メニュー */}
                    <Flex
                        gap={7}
                        alignItems="center"
                        display={{ base: "none", md: "flex" }}
                    >
                        <HeaderLink to="/">ホーム</HeaderLink>
                        <HeaderLink to="/info">試験概要</HeaderLink>
                        <HeaderLink to="/exams">過去問一覧</HeaderLink>

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
                                    h="40px"
                                    px={5}
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
                                    h="40px"
                                    px={5}
                                >
                                    ログイン
                                </Button>
                            </>
                        )}
                    </Flex>

                    {/* スマホ右メニュー */}
                    <Flex
                        display={{ base: "flex", md: "none" }}
                        gap={2}
                        alignItems="center"
                    >
                        {!user && (
                            <Button
                                as={RouterLink}
                                to="/register"
                                backgroundColor="#60A5FA"
                                color="accentTextColor"
                                _hover={{ bg: "#4F94F7" }}
                                borderRadius="full"
                                fontSize="sm"
                                h="30px"
                                px={3}
                                textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                            >
                                無料で始める
                            </Button>
                        )}

                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label="メニューを開く"
                                icon={<HamburgerIcon boxSize={6} />}
                                variant="ghost"
                                color="baseTextColor"
                                bg="transparent"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                            />
                            <MenuList bg="white" color="gray.800">
                                <MobileMenuItem text="ホーム" to="/" />
                                <MobileMenuItem text="試験概要" to="/info" />
                                <MobileMenuItem text="過去問一覧" to="/exams" />

                                {user ? (
                                    <MobileMenuItem
                                        text="MyPage"
                                        to="/my-page"
                                    />
                                ) : (
                                    <MobileMenuItem
                                        text="ログイン"
                                        to="/login"
                                    />
                                )}
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
