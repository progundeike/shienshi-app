import {
    Box,
    Container,
    Heading,
    List,
    ListItem,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";

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

export const TermsPage: FC = memo(() => {
    return (
        <Container maxW="900px" py={{ base: 10, md: 16 }}>
            <VStack align="stretch" gap={8}>
                <Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: "2xl", md: "4xl" }}
                        mb={4}
                    >
                        利用規約
                    </Heading>
                    <BodyText>
                        この利用規約（以下、「本規約」といいます。）は、支援士対策室（以下、「当サービス」といいます。）の提供条件および当サービスの利用に関する当サービス運営者とユーザーとの間の権利義務関係を定めるものです。
                        <br />
                        ユーザーは、本規約に同意のうえ、当サービスを利用するものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第1条（適用）</SectionTitle>
                    <BodyText>
                        本規約は、ユーザーと当サービス運営者との間の当サービスの利用に関わる一切の関係に適用されます。
                        <br />
                        当サービス運営者は、当サービスに関し、本規約のほか、個別のルール、ガイドライン、注意事項等を定めることがあります。
                        <br />
                        これらは本規約の一部を構成するものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第2条（利用登録）</SectionTitle>
                    <BodyText>
                        当サービスの利用を希望する者は、本規約に同意のうえ、当サービス運営者の定める方法によって利用登録を申請し、当サービス運営者がこれを承認することによって、利用登録が完了するものとします。
                        <br />
                        当サービス運営者は、以下のいずれかに該当すると判断した場合、利用登録の申請を承認しないことがあり、その理由について一切の開示義務を負わないものとします。
                    </BodyText>
                    <List spacing={2} pl={4} mt={2} styleType="disc">
                        <ListItem>虚偽の事項を届け出た場合</ListItem>
                        <ListItem>
                            本規約に違反したことがある者からの申請である場合
                        </ListItem>
                        <ListItem>
                            その他、当サービス運営者が利用登録を相当でないと判断した場合
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <SectionTitle>第3条（アカウント情報の管理）</SectionTitle>
                    <BodyText>
                        ユーザーは、自己の責任において、当サービスのアカウント情報を適切に管理するものとします。
                        <br />
                        ユーザーは、いかなる場合にも、アカウントを第三者に譲渡、貸与し、または共有してはならないものとします。
                        <br />
                        アカウント情報の管理不十分、使用上の過誤、第三者の使用等によって生じた損害について、当サービス運営者は故意または重過失がある場合を除き、責任を負いません。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第4条（サービス内容）</SectionTitle>
                    <BodyText>
                        当サービスは、試験学習を支援することを目的として、問題閲覧、回答記録、AIによる添削、AIへの質問機能、その他関連機能を提供します。
                        <br />
                        当サービス運営者は、ユーザーに事前に通知することなく、当サービスの内容を変更し、追加し、または廃止できるものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第5条（禁止事項）</SectionTitle>
                    <BodyText>
                        ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
                    </BodyText>
                    <List spacing={2} pl={4} styleType="disc">
                        <ListItem>法令または公序良俗に違反する行為</ListItem>
                        <ListItem>犯罪行為に関連する行為</ListItem>
                        <ListItem>
                            当サービスまたは第三者の知的財産権、肖像権、プライバシーその他の権利を侵害する行為
                        </ListItem>
                        <ListItem>
                            当サービスのサーバーまたはネットワークの機能を破壊し、または妨害する行為
                        </ListItem>
                        <ListItem>
                            当サービスを不正な目的で利用する行為
                        </ListItem>
                        <ListItem>
                            自動化ツール、ボット、スクレイピングその他これらに類する手段により、当サービスへ過度の負荷を与える行為
                        </ListItem>
                        <ListItem>
                            不正アクセスをし、またはこれを試みる行為
                        </ListItem>
                        <ListItem>
                            他のユーザーのアカウントを利用する行為
                        </ListItem>
                        <ListItem>
                            AI機能に対して、当サービスの内部情報や保護対象情報を不正に引き出そうとする行為
                        </ListItem>
                        <ListItem>
                            当サービス運営者が不適切と判断するその他の行為
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <SectionTitle>第6条（知的財産権）</SectionTitle>
                    <BodyText>
                        当サービスに関するプログラム、デザイン、文章、画像、商標その他一切のコンテンツに関する知的財産権は、当サービス運営者または正当な権利者に帰属します。
                        <br />
                        ユーザーは、法令で認められる範囲を超えて、当サービス内のコンテンツを複製、転載、配布、改変、公衆送信その他の方法で利用してはなりません。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第7条（ユーザー投稿データ等）</SectionTitle>
                    <BodyText>
                        ユーザーが当サービスに入力、送信または保存した回答、
                        質問、文章その他のデータについて、ユーザーは自ら必要な権利を有し、
                        または適法に利用できることを保証するものとします。
                        <br />
                        当サービス運営者は、当サービスの提供、運営、改善、
                        不具合対応、品質向上のために必要な範囲で、
                        これらのデータを利用できるものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第8条（AI機能に関する注意）</SectionTitle>
                    <BodyText>
                        当サービスで提供されるAIによる回答、添削、助言その他の出力結果は、その正確性、完全性、有用性を常に保証するものではありません。
                        <br />
                        ユーザーは、AIの出力結果を自己の判断と責任において利用するものとし、当サービス運営者は、故意または重過失がある場合を除き、AI出力の利用により生じた損害について責任を負いません。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第9条（利用制限および登録抹消）</SectionTitle>
                    <BodyText>
                        当サービス運営者は、ユーザーが以下のいずれかに該当する場合、事前の通知なく、当該ユーザーに対して当サービスの全部または一部の利用を制限し、または利用登録を抹消することができます。
                    </BodyText>
                    <List spacing={2} pl={4} mt={2} styleType="disc">
                        <ListItem>
                            本規約のいずれかの条項に違反した場合
                        </ListItem>
                        <ListItem>
                            登録事項に虚偽の事実があることが判明した場合
                        </ListItem>
                        <ListItem>
                            その他、当サービスの利用を適当でないと判断した場合
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <SectionTitle>第10条（サービスの停止・中断）</SectionTitle>
                    <BodyText>
                        当サービス運営者は、以下のいずれかの事由がある場合、ユーザーに事前に通知することなく、当サービスの全部または一部の提供を停止または中断することができます。
                    </BodyText>
                    <List spacing={2} pl={4} mt={2} styleType="disc">
                        <ListItem>
                            システムの保守点検または更新を行う場合
                        </ListItem>
                        <ListItem>
                            地震、落雷、火災、停電、天災等の不可抗力により提供が困難となった場合
                        </ListItem>
                        <ListItem>
                            通信回線またはコンピュータに障害が生じた場合
                        </ListItem>
                        <ListItem>
                            その他、当サービス運営者が停止または中断を必要と判断した場合
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <SectionTitle>第11条（免責事項）</SectionTitle>
                    <BodyText>
                        当サービス運営者は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定目的適合性、セキュリティ等に関する欠陥、エラーやバグ、権利侵害等を含みますが、これらに限られません。）がないことを保証しません。
                        <br />
                        当サービス運営者は、当サービスに起因してユーザーに生じたあらゆる損害について、当サービス運営者の故意または重過失による場合を除き、責任を負いません。
                        <br />
                        ただし、当サービスに関する契約が消費者契約法に定める消費者契約に該当する場合、この免責は同法により制限される範囲で適用されます。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第12条（退会）</SectionTitle>
                    <BodyText>
                        ユーザーは、当サービス運営者の定める方法により、いつでも当サービスを退会できるものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第13条（規約の変更）</SectionTitle>
                    <BodyText>
                        当サービス運営者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更できるものとします。
                        <br />
                        変更後の本規約は、当サービス上に掲載した時点から効力を生じるものとします。
                    </BodyText>
                </Box>

                <Box>
                    <SectionTitle>第14条（準拠法および裁判管轄）</SectionTitle>
                    <BodyText>
                        本規約の解釈にあたっては、日本法を準拠法とします。
                        <br />
                        当サービスに関して紛争が生じた場合には、当サービス運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
                    </BodyText>
                </Box>

                <Box pt={4}>
                    <BodyText>制定日：2026年4月1日</BodyText>
                    {/* <BodyText color="gray.600">
                        最終改定日：2026年◯月◯日
                    </BodyText> */}
                </Box>
            </VStack>
        </Container>
    );
});
