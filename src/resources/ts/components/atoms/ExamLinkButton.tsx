import { Box, Button, Flex, HStack, VStack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";
import { LuBadgeCheck } from "react-icons/lu";

type Props = {
    title: string;
    url: string;
    isSubmitted?: boolean;
};

export const ExamLinkButton: FC<Props> = memo(
    ({ title, url, isSubmitted = false }) => {
        return (
            <Button
                position="relative"
                as={Link}
                to={"/exams/" + url}
                bg="blue.50"
                color="blue.700"
                border="1px solid"
                borderColor="blue.100"
                borderRadius="xl"
                w="100%"
                size={{ base: "sm", md: "md" }}
                px={{ base: 3, md: 5 }}
                py={{ base: 5, md: 6 }}
                fontWeight="600"
                justifyContent="center"
                boxShadow="sm"
                transition="all 0.2s ease"
                _hover={{
                    bg: "blue.100",
                    borderColor: "blue.200",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                    textDecoration: "none",
                }}
                _active={{
                    transform: "translateY(0)",
                    boxShadow: "sm",
                }}
            >
                <Flex align="center" justify="center" gap={1} w="100%">
                    <Box>{title}</Box>

                    {isSubmitted && (
                        <Box
                            position={{ base: "static", md: "absolute" }}
                            right={{ md: 5 }}
                            color="green.600"
                            top={{ base: "50%" }}
                            transform={{ md: "translateY(-50%)" }}
                            aria-label="答案提出済み"
                            fontSize={{ base: "18px", md: "22px" }}
                        >
                            <LuBadgeCheck size="1em" strokeWidth={2.5} />
                        </Box>
                    )}
                </Flex>
            </Button>
        );
    },
);
