import {
    Center,
    Flex,
    Box,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
} from "@chakra-ui/react";
import { FC } from "react";

type Props = {
    purpose: string | null;
    reviewComment: string | null;
};

export const DisplayPurposeAndReviewComment: FC<Props> = (props) => {
    const { purpose, reviewComment } = props;

    const displayPurpose = purpose ?? "出題趣旨を取得できませんでした";
    const displayReviewComment =
        reviewComment ?? "採点講評を取得できませんでした";

    return (
        <Center w="100%">
            <Accordion allowToggle defaultIndex={0} w="100%">
                <AccordionItem w="100%">
                    <Flex direction="column" gap="20px">
                        <AccordionButton>
                            <Box flex="1" textAlign="center">
                                <Text>IPAによる出題趣旨と採点講評</Text>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel>
                            <Box>
                                <Text fontSize="xl" fontWeight="bold">
                                    出題趣旨
                                </Text>
                                {displayPurpose
                                    .split(/\n/)
                                    .map((paragraph, index) => (
                                        <Text
                                            key={index}
                                            lineHeight="1.6"
                                            mb="1em"
                                        >
                                            {paragraph}
                                        </Text>
                                    ))}
                            </Box>

                            <Box>
                                <Text fontSize="xl" fontWeight="bold">
                                    採点講評
                                </Text>
                                {displayReviewComment
                                    .split(/\n/)
                                    .map((paragraph, index) => (
                                        <Text
                                            key={index}
                                            lineHeight="1.6"
                                            mb="1em"
                                        >
                                            {paragraph}
                                        </Text>
                                    ))}
                            </Box>
                        </AccordionPanel>
                    </Flex>
                </AccordionItem>
            </Accordion>
        </Center>
    );
};
