import { Flex, Box, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { Md10K } from "react-icons/md";

type Props = {
    children: React.ReactNode;
    yearLabel: string;
    title: string;
    color: string;
};

export const ExamPeriodCard: FC<Props> = (props) => {
    const { children, yearLabel, title, color } = props;

    return (
        <Flex
            flex="1"
            direction="column"
            borderRadius="xl"
            border="1px solid"
            borderColor={color}
            overflow="hidden"
        >
            <Box
                bg={color}
                color="white"
                textAlign="center"
                borderTopRadius="md"
            >
                <Box px={2} py={1}>
                    <Text
                        fontSize={{ base: "md", md: "xl" }}
                        fontWeight="bold"
                        textShadow="0 1px 2px rgba(0, 0, 0, 0.25)"
                    >
                        {yearLabel}
                    </Text>
                </Box>
            </Box>
            <Box m={2}>
                <Text
                    fontWeight="bold"
                    fontSize={{ base: "md", md: "xl" }}
                    color={color}
                >
                    {title}
                </Text>
            </Box>
            <Flex direction="column" m={2} gap={2}>
                {children}
            </Flex>
        </Flex>
    );
};
