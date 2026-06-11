import { Button, Tooltip } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    url: string;
    title: string;
};

export const PreReleaseExamLinkButton: FC<Props> = memo(({ url, title }) => {
    return (
        <Tooltip label="制作中です" hasArrow>
            <Button
                bg="gray.50"
                color="gray.500"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                w="100%"
                size={{ base: "sm", md: "md" }}
                px={{ base: 3, md: 5 }}
                py={{ base: 5, md: 6 }}
                fontWeight="600"
                justifyContent="center"
                boxShadow="sm"
                cursor="not-allowed"
                opacity={0.75}
                _hover={{
                    bg: "gray.50",
                    borderColor: "gray.200",
                    boxShadow: "sm",
                }}
                _active={{
                    bg: "gray.50",
                    boxShadow: "sm",
                }}
            >
                {title}
            </Button>
        </Tooltip>
    );
});
