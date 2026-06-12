import { Button } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

type Props = {
    title: string;
    url: string;
};

export const ExamLinkButton: FC<Props> = memo(({ title, url }) => {
    return (
        <Button
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
            {title}
        </Button>
    );
});
