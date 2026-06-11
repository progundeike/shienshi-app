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
import { FC, memo } from "react";
import { FiPlus } from "react-icons/fi";
import { IoMdDownload } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const ExamHeader: FC<Props> = memo((props) => {
    const { year, season, section } = props;

    const yearToJapaneseCalender = (year: number) => {
        if (year >= 2019) {
            return "令和" + (year - 2018);
        } else {
            return "平成" + (year - 1988);
        }
    };

    const seasonToJapanese = (season: string) => {
        if (season == "haru") {
            return "春期";
        } else if (season == "aki") {
            return "秋期";
        } else {
            return "未登録";
        }
    };

    const sectionToTitle = (section: number, year: number) => {
        if (year >= 2024 || (year == 2023 && season == "aki")) {
            return "午後問" + section;
        } else {
            if (section < 4) {
                return "午後I 問" + section;
            } else {
                return "午後II 問" + (section - 3);
            }
        }
    };

    return (
        <Box
            backgroundColor="#F0F4F8"
            borderBottom="1px solid"
            borderColor="gray.200"
        >
            <Box my="auto" w="100%" px={{ base: 1, md: 4 }} py={1} mx="auto">
                <Flex justifyContent="space-between" align="center">
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
                                {`${year}年 (${yearToJapaneseCalender(year)}年)`}
                                <Box>
                                    {`${seasonToJapanese(season)} ${sectionToTitle(section, year)}`}
                                </Box>
                            </Flex>
                        </Heading>

                        <Box
                            display={{ base: "none", md: "flex" }}
                            alignItems="center"
                            gap={1.5}
                            bg="white"
                            color="blue.700"
                            border="1px solid"
                            borderColor="blue.100"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="medium"
                        >
                            <Icon as={FiPlus} boxSize={4} color="gray.600" />
                            <Text>PDF上をドラッグしてハイライトできます</Text>
                        </Box>
                    </VStack>

                    <Flex gap={0} align="center">
                        <Box>
                            <Button
                                as={Link}
                                href={`/storage/pdf/${year}/${year}_${season}_${section}.pdf`}
                                download
                                borderRadius="full"
                                size={{ base: "sm", md: "md" }}
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
                                    display={{
                                        base: "inline-flex",
                                        md: "none",
                                    }}
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
