import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";
import { GrCircleInformation } from "react-icons/gr";
import { AiOutlineUser } from "react-icons/ai";
import { FaEdit, FaList, FaUserCircle } from "react-icons/fa";
import { useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { IconLink } from "../atoms/IconLink";

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
                        <IconLink url="/about" icon={GrCircleInformation}>
                            about
                        </IconLink>
                        <IconLink url="/exams_list" icon={FaList}>
                            過去問一覧
                        </IconLink>

                        {user ? (
                            <IconLink url="/my-page" icon={FaUserCircle}>
                                MyPage
                            </IconLink>
                        ) : (
                            <>
                                <IconLink url="/login" icon={AiOutlineUser}>
                                    ログイン
                                </IconLink>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
