import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    HStack,
    Button,
    list,
    Container,
    VStack,
} from "@chakra-ui/react";
import { FC, memo } from "react";

import { Card } from "../atoms/Card";
import { dateUtils } from "../../utils/dateUtils";
import { DisplayNewsItemList } from "../organisms/DisplayNewsItemList";
import { LuBell } from "react-icons/lu";
import { Link } from "react-router-dom";

export const PrivacyPolicyPage: FC = memo(() => {
    return (
        <Box maxW="1200px" w="100%" mx="auto" px={{ base: 4, md: 6 }}>
            <Container maxW="900px" py={{ base: 10, md: 16 }}>
                <VStack align="stretch" gap={8}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "4xl" }}
                            mb={4}
                        >
                            プライバシーポリシー
                        </Heading>
                        <Text
                            color="gray.600"
                            fontSize={{ base: "sm", md: "md" }}
                        >
                            支援士対策室（以下、「当サービス」といいます。）は、
                            ユーザーの個人情報の重要性を認識し、個人情報の保護に関する法律その他の関係法令を遵守するとともに、
                            以下のプライバシーポリシーに従って、適切に個人情報を取り扱います。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            1. 取得する情報
                        </Heading>
                        <Text lineHeight="tall">
                            当サービスは、以下の情報を取得することがあります。
                        </Text>
                        <Box pl={4} pt={2}>
                            <Text lineHeight="tall">
                                ・氏名またはニックネーム
                            </Text>
                            {/* <Text lineHeight="tall">・メールアドレス</Text> */}
                            <Text lineHeight="tall">・ログイン情報</Text>
                            <Text lineHeight="tall">・お問い合わせ内容</Text>
                            <Text lineHeight="tall">
                                ・学習履歴、回答内容、利用状況
                            </Text>
                            <Text lineHeight="tall">
                                ・Cookie等を用いて取得されるアクセス情報
                            </Text>
                        </Box>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            2. 利用目的
                        </Heading>
                        <Text lineHeight="tall">
                            取得した情報は、以下の目的で利用します。
                        </Text>
                        <Box pl={4} pt={2}>
                            <Text lineHeight="tall">
                                ・当サービスの提供、運営のため
                            </Text>
                            <Text lineHeight="tall">
                                ・本人確認、ログイン認証、ユーザー管理のため
                            </Text>
                            <Text lineHeight="tall">
                                ・学習機能、AI添削機能、AI質問機能の提供のため
                            </Text>
                            <Text lineHeight="tall">
                                ・サービス改善、品質向上、新機能開発のため
                            </Text>
                            <Text lineHeight="tall">
                                ・お問い合わせへの対応のため
                            </Text>
                            <Text lineHeight="tall">
                                ・不正利用の防止、セキュリティ確保のため
                            </Text>
                        </Box>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            3. 個人情報の第三者提供
                        </Heading>
                        <Text lineHeight="tall">
                            当サービスは、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            4. 外部サービスの利用
                        </Heading>
                        <Text lineHeight="tall">
                            当サービスでは、サービス提供や品質向上のために、外部サービスを利用する場合があります。
                            これに伴い、必要な範囲で情報が外部事業者に送信されることがあります。
                        </Text>
                        <Box pl={4} pt={2}>
                            <Text lineHeight="tall">
                                ・サーバー、インフラ提供サービス
                            </Text>
                            <Text lineHeight="tall">
                                ・AI関連API提供サービス
                            </Text>
                        </Box>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            5. Cookie等の利用
                        </Heading>
                        <Text lineHeight="tall">
                            当サービスは、利便性向上、利用状況の把握、広告・分析等のためにCookie等を使用することがあります。
                            ユーザーはブラウザ設定によりCookieを無効にできますが、その場合、一部機能が利用できなくなることがあります。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            6. 安全管理措置
                        </Heading>
                        <Text lineHeight="tall">
                            当サービスは、個人情報への不正アクセス、漏えい、滅失、毀損等を防止するため、
                            必要かつ適切な安全管理措置を講じます。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            7. 開示、訂正、削除等の請求
                        </Heading>
                        <Text lineHeight="tall">
                            ユーザーは、当サービスが保有する自己の個人情報について、
                            開示、訂正、追加、削除、利用停止等を求めることができます。
                            請求を希望する場合は、下記のお問い合わせ窓口までご連絡ください。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            8. 未成年の利用について
                        </Heading>
                        <Text lineHeight="tall">
                            未成年の方が当サービスを利用する場合は、必要に応じて保護者の同意を得たうえでご利用ください。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            9. プライバシーポリシーの変更
                        </Heading>
                        <Text lineHeight="tall">
                            当サービスは、必要に応じて本ポリシーを変更することがあります。
                            変更後の内容は、当サービス上に掲載した時点から効力を生じるものとします。
                        </Text>
                    </Box>

                    <Box>
                        <Heading
                            as="h2"
                            fontSize={{ base: "lg", md: "2xl" }}
                            mb={3}
                        >
                            10. お問い合わせ窓口
                        </Heading>
                        <Text lineHeight="tall">
                            本ポリシーに関するお問い合わせは、当サービスの
                            <Link
                                to="/contact"
                                style={{
                                    textDecoration: "underline",
                                    textUnderlineOffset: "4px",
                                    textDecorationThickness: "0.5px",
                                }}
                            >
                                お問い合わせフォーム
                            </Link>
                            よりご連絡ください。
                        </Text>
                    </Box>

                    <Box pt={4}>
                        <Text color="gray.600">制定日：2026年◯月◯日</Text>
                        {/* <Text color="gray.600">最終改定日：2026年◯月◯日</Text> */}
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
});
