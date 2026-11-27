import {
    Flex,
    Heading,
    Button,
    Box,
    Link,
    Popover,
    PopoverTrigger,
    IconButton,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    VStack,
    Text,
    Icon,
} from "@chakra-ui/react";
import { FC, memo, type ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import { IoMdDownload } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { getExamTitleParts } from "../../utils/examTitle";

type Props = {
    year: number;
    season: string;
    section: number;
    actions?: ReactNode;
};

export const ExamHeader: FC<Props> = memo((props) => {
    const { year, season, section, actions } = props;

    const { yearLabel, japaneseYearLabel, sessionLabel } = getExamTitleParts(
        year,
        season,
        section,
    );

    return (
        <Box
            backgroundColor="#F0F4F8"
            borderBottom="1px solid"
            borderColor="gray.200"
        >
            <Box my="auto" w="100%" px={{ base: 1, md: 4 }} py={1} mx="auto">
                <Flex
                    justifyContent="space-between"
                    align="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <VStack
                        textAlign="left"
                        align="flex-start"
                        ml={{ base: 2, md: 5 }}
                        spacing={2}
                    >
                        <Heading
                            as="h2"
                            size={{ base: "xs", md: "md" }}
                            display="flex"
                            flexDirection={{ base: "column", md: "row" }}
                        >
                            <Flex
                                gap={{ base: 1, md: 2 }}
                                direction={{ base: "column", md: "row" }}
                            >
                                {`${yearLabel} (${japaneseYearLabel})`}
                                <Box>{sessionLabel}</Box>
                            </Flex>
                        </Heading>
                    </VStack>

                    <Flex gap={2} align="center" flexWrap="wrap">
                        {actions}
                        <Box>
                            <Button
                                as={Link}
                                href={`/storage/pdf/${year}/${year}_${season}_${section}.pdf`}
                                download
                                borderRadius="full"
                                size="sm"
                                h="32px"
                                px={4}
                                fontSize="sm"
                                fontWeight="medium"
                                variant="outline"
                                colorScheme="blue"
                                bg="white"
                                rightIcon={<IoMdDownload />}
                                _hover={{
                                    bg: "blue.50",

                                    textDecoration: "none",
                                }}
                            >
                                問題をダウンロード
                            </Button>
                        </Box>

                        <Popover trigger="click">
                            <PopoverTrigger>
                                <IconButton
                                    aria-label="PDFの表示について"
                                    icon={
                                        <IoInformationCircleOutline fontSize="24px" />
                                    }
                                    size="sm"
                                    variant="ghost"
                                    color="gray.500"
                                    borderRadius="full"
                                    minW="34px"
                                    w="34px"
                                    h="34px"
                                />
                            </PopoverTrigger>
                            <PopoverContent w="220px">
                                <PopoverArrow />
                                <PopoverBody fontSize="sm">
                                    問題はモニターで見やすいように余白を調整しています
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
