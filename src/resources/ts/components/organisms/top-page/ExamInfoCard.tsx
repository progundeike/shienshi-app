import { Box, Flex, Icon, Heading, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { IconType } from "react-icons";

export const ExamInfoCard: FC<{
    icon: IconType;
    subIcon: IconType;
    title: string;
    children: React.ReactNode;
    note: string;
}> = memo(({ icon, subIcon, title, children, note }) => {
    return (
        <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="sm"
            p={7}
            h="full"
            display="flex"
        >
            <Flex direction="column" gap={3} h="100%" w="100%">
                <Flex align="center" gap={3}>
                    <Flex
                        align="center"
                        justify="center"
                        w={{ base: 10, md: 12 }}
                        h={{ base: 10, md: 12 }}
                        borderRadius="full"
                        bg="baseColor"
                        color="white"
                        flexShrink={0}
                    >
                        <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
                    </Flex>
                    <Heading
                        as="h3"
                        size={{ base: "sm", md: "md" }}
                        color="baseColor"
                    >
                        {title}
                    </Heading>
                </Flex>
                <Box flex="1">{children}</Box>
                <Box
                    mt={4}
                    bg="blue.50"
                    borderRadius="md"
                    px={4}
                    py={3}
                    color="baseColor"
                >
                    <Flex align="center" gap={2}>
                        <Flex
                            align="center"
                            justify="center"
                            w={{ base: 10, md: 12 }}
                            h={{ base: 10, md: 12 }}
                            borderRadius="md"
                            color="baseColor"
                            flexShrink={0}
                        >
                            <Icon as={subIcon} boxSize={{ base: 7, md: 9 }} />
                        </Flex>
                        <Text>{note}</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
});
