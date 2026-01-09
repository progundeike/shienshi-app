import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { FC, memo } from "react";

import { Card } from "../atoms/Card";
import { dateUtils } from "../../utils/dateUtils";
import { DisplayNewsItemList } from "../organisms/DisplayNewsItemList";
import { LuBell } from "react-icons/lu";

export const TopPage: FC = memo(() => {
    const { examYear, examMonth, examDate } = dateUtils();

    return (
        <Box w="80%" my="20px" mx="auto">
            <Flex gap="20px" direction="column">
                {/* CBT方式への移行に伴い試験日表示は一旦非表示
                <Box>
                    <Heading size="md">
                        次の試験日は
                        {`${examYear}年 ${examMonth}月 ${examDate}日`}
                    </Heading>
                    <Box>コンテンツ</Box>
                </Box> */}

                {/* サービス説明 */}
                <Box my="50px" textColor="baseColor">
                    <Flex>
                        <Box>
                            <Text fontSize="80px" fontWeight="bold">
                                解く→添削→訊く。
                            </Text>
                            <Text fontSize="2xl" mb="20px">
                                「フカボリ」は、情報処理安全確保支援士試験の午後対策に特化した学習支援サービスです。
                                <br />
                                AIを活用した添削機能と質問機能により、効率的な学習をサポートします。
                                <br />
                                ユーザー登録は無料で、すぐに学習を始めることができます。
                                <br />
                                ぜひご活用ください。
                            </Text>
                        </Box>
                        <Image
                            src="/images/main_visual.png"
                            w="30%"
                            objectFit="cover"
                            alt="メインビジュアル"
                        />
                    </Flex>
                </Box>

                {/* 試験概要 */}
                <Card>
                    <Flex gap="30px" direction="column">
                        <Heading size="xl" color="baseColor">
                            情報処理安全確保支援士試験について
                        </Heading>
                        <Box textAlign="left">
                            <Text>
                                情報処理安全確保支援士試験は、ーーーーな試験です。
                                <br />
                                情報処理推進機構(IPA)が実施する国家試験の中で最高難易度(レベル4)に位置付けられており、合格率は例年19%前後で推移しています。
                                2026年よりCBT方式への移行に伴い、これまでの午前I試験は、科目A-1試験へ、午前Ⅱ試験は、科目A-2試験へ、午後試験は、科目B試験へと名称変更されます。
                                <br />
                                科目B試験(旧午後試験)は、試験時間150分、出題される4つの設問から2つを選択し、解答します。各設問は50点満点で、合計100点満点中60点以上で合格となります。
                                <br />
                            </Text>
                        </Box>
                    </Flex>
                </Card>

                {/* お知らせ */}
                <Card>
                    <Box mb="20px">
                        <Heading size="xl" color="baseColor">
                            <LuBell
                                style={{
                                    display: "inline",
                                    marginBottom: "-4px",
                                    marginRight: "8px",
                                }}
                            />
                            お知らせ
                        </Heading>
                    </Box>
                    <DisplayNewsItemList />
                </Card>

                {/* about */}
                <Card>
                    <Heading size="xl" color="baseColor">
                        このサイトについて
                    </Heading>
                    <Box textAlign="left" mt="10px">
                        <Text>
                            「フカボリ」は、情報処理安全確保支援士試験の午後対策に特化した学習支援サービスです。
                            <br />
                            AIを活用した添削機能と質問機能により、効率的な学習をサポートします。
                            <br />
                            ユーザー登録は無料で、すぐに学習を始めることができます。
                            <br />
                            ぜひご活用ください。
                        </Text>
                    </Box>
                </Card>
            </Flex>
        </Box>
    );
});
