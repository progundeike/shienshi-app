import { Flex, Heading, Button, Box, Link } from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { IoMdDownload } from "react-icons/io";

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
            m="auto"
            w={{ base: "100%", md: "90%" }}
            maxW="1500px"
            p="5px"
            h="50px"
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h2" size="md">
                    {`${year}年 (${yearToJapaneseCalender(
                        year
                    )}年) ${seasonToJapanese(season)} ${sectionToTitle(
                        section,
                        year
                    )}`}
                </Heading>
                <Box>
                    <Link
                        href={`/pdf/${year}_${season}_${section}.pdf`}
                        download
                    >
                        <Button
                            backgroundColor="accentColor"
                            color="accentTextColor"
                        >
                            問題をダウンロード
                            <IoMdDownload />
                        </Button>
                    </Link>
                </Box>
            </Flex>
        </Box>
    );
});
