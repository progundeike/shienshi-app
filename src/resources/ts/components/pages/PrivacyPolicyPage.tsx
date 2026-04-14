import {
    Box,
    Heading,
    Text,
    Container,
    VStack,
    List,
    ListItem,
} from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";

import { Link } from "react-router-dom";

const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => (
    <Heading as="h2" fontSize={{ base: "lg", md: "2xl" }} mb={3}>
        {children}
    </Heading>
);

const BodyText: FC<{ children: ReactNode }> = ({ children }) => (
    <Text lineHeight="tall" fontSize={{ base: "sm", md: "md" }}>
        {children}
    </Text>
);

export const PrivacyPolicyPage: FC = memo(() => {
    return (
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
                    <BodyText>
                        支援士対策室（以下、「当サービス」といいます。）は、ユーザーの個人情報の重要性を認識し、
                        <br />
                        個人情報の保護に関する法律その他の関係法令を遵守するとともに、以下のプライバシーポリシーに従って、
                        <br />
                        適切に個人情報を取り扱います。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>1. 取得する情報</SectionTitle>
                    <BodyText>
                        当サービスは、以下の情報を取得することがあります。
                    </BodyText>
                    <List spacing={2} pl={4} mt={2} styleType="disc">
                        <ListItem>ログインに必要な認証情報</ListItem>
                        <ListItem>
                            お問い合わせフォームに入力された情報
                        </ListItem>
                        <ListItem>
                            学習履歴、回答内容、AIへの質問内容、AIからの回答内容
                        </ListItem>
                        <ListItem>
                            Cookie等を用いて取得されるアクセス情報
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <SectionTitle>2. 利用目的</SectionTitle>
                    <BodyText>
                        取得した情報は、以下の目的で利用します。
                    </BodyText>
                    <List spacing={2} pl={4} mt={2} styleType="disc">
                        <ListItem>当サービスの提供、運営のため</ListItem>
                        <ListItem>
                            本人確認、ログイン認証、ユーザー管理のため
                        </ListItem>
                        <ListItem>
                            学習機能、AI添削機能、AI質問機能の提供のため
                        </ListItem>
                        <ListItem>
                            サービス改善、品質向上、新機能開発のため
                        </ListItem>
                        <ListItem>お問い合わせへの対応のため</ListItem>
                        <ListItem>
                            不正利用の防止、セキュリティ確保のため
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <SectionTitle>3. 個人情報の第三者提供</SectionTitle>
                    <BodyText>
                        当サービスは、法令に基づく場合その他個人情報保護法で認められる場合を除き、本人の同意なく個人データを第三者に提供しません。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>4. 外部サービスの利用</SectionTitle>
                    <BodyText>
                        当サービスでは、サービス提供、運営、保守および品質向上のために、外部事業者の提供するクラウドサービス、サーバー、AI関連サービス等を利用する場合があります。
                        <br />
                        AI機能の提供にあたり、ユーザーが入力した質問、回答その他の内容の一部または全部が、必要な範囲で外部AI事業者に送信されることがあります。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>5. Cookie等の利用</SectionTitle>
                    <BodyText>
                        当サービスは、ログイン状態の保持その他サービスの利便性向上および利用状況の把握のために、Cookie等を使用することがあります。
                        <br />
                        ユーザーはブラウザ設定によりCookieを無効にできますが、その場合、一部機能が利用できなくなることがあります。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>6. 安全管理措置</SectionTitle>
                    <BodyText>
                        当サービスは、個人情報への不正アクセス、漏えい、滅失、毀損等を防止するため、必要かつ適切な安全管理措置を講じます。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>7. 開示、訂正、削除等の請求</SectionTitle>
                    <BodyText>
                        ユーザーは、法令の定めに従い、当サービスが保有する保有個人データについて、開示、訂正、追加、削除、利用停止等を求めることができます。
                        <br />
                        請求を希望する場合は、下記のお問い合わせ窓口までご連絡ください。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>8. 未成年の利用について</SectionTitle>
                    <BodyText>
                        未成年の方が当サービスを利用する場合は、必要に応じて保護者の同意を得たうえでご利用ください。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>9. プライバシーポリシーの変更</SectionTitle>
                    <BodyText>
                        当サービスは、必要に応じて本ポリシーを変更することがあります。
                        <br />
                        変更後の内容は、当サービス上に掲載した時点から効力を生じるものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>10. お問い合わせ窓口</SectionTitle>

                    <BodyText>
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
                    </BodyText>
                </Box>

                <Box pt={4}>
                    <Text color="gray.600">制定日：2026年4月1日</Text>
                    {/* <Text color="gray.600">最終改定日：2026年◯月◯日</Text> */}
                </Box>
            </VStack>
        </Container>
    );
});
