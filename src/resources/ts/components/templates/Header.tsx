import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";
import { GrCircleInformation } from "react-icons/gr";
import { AiOutlineUser } from "react-icons/ai";
import { FaList, FaUserCircle, FaHome } from "react-icons/fa";
import { useAtomValue } from "jotai";
import { TbCircleKey } from "react-icons/tb";

import { userAtom } from "../../states/userAtom";
import { IconLink } from "../atoms/IconLink";
import { dateUtils } from "../../utils/dateUtils";

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
            <Box w="90%" m="auto" py="5px" px={{ base: 4, md: 6 }}>
                <Flex
                    justifyContent="space-between"
                    wrap="wrap"
                    alignItems="center"
                >
                    {/* 左バナー */}
                    <Link to="/">
                        <Flex direction="column">
                            <Box mb="0px">
                                <Heading
                                    as="h1"
                                    size="md"
                                    fontSize="50px"
                                    fontWeight="400"
                                    color="baseTextColor"
                                    textShadow="1px 1px 1px gray"
                                >
                                    フカボリ
                                </Heading>
                            </Box>
                            <Box mt="-8px">
                                <Text fontSize="18px" color="#92c4fc">
                                    情報処理安全確保支援士 午後対策
                                </Text>
                            </Box>
                        </Flex>
                    </Link>
                    {/* <Box fontSize="20px">
                        試験まで残り{daysUntilNextExam()}日
                    </Box> */}

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

                        {user?.isAdmin && (
                            <IconLink url="/admin" icon={TbCircleKey}>
                                管理ページ
                            </IconLink>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
