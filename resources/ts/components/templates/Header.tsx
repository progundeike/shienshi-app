import { Box, Flex, Heading } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";
import { GrCircleInformation } from "react-icons/gr";
import { AiOutlineUser } from "react-icons/ai";
import { FaList, FaUserCircle, FaHome } from "react-icons/fa";
import { useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { IconLink } from "../atoms/IconLink";
import { dateUtils } from "../../utils/dateUtils";

export const Header: FC = memo(() => {
    const user = useAtomValue(userAtom);
    const { daysUntilNextExam } = dateUtils();

    return (
        <Box backgroundColor="baseColor" color={"baseTextColor"}>
            <Box w="90%" m="auto" p="12px">
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
                            color="baseTextColor"
                            textShadow="1px 1px 1px gray"
                        >
                            情報処理安全確保支援士 午後対策
                        </Heading>
                    </Link>
                    <Box fontSize="20px">
                        試験まで残り{daysUntilNextExam()}日
                    </Box>

                    {/* 右メニュー */}
                    {/* {isMobileView ? <MobileMenu /> : <PcMenu />} */}
                    <Flex gap="20px">
                        <IconLink url="/" icon={FaHome}>
                            TOP
                        </IconLink>
                        <IconLink url="/exams_list" icon={FaList}>
                            過去問一覧
                        </IconLink>
                        <IconLink url="/about" icon={GrCircleInformation}>
                            ABOUT
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
