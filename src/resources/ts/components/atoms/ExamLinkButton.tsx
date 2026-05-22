import { Button } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";
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
            backgroundColor="accentColor"
            w={{ base: "100%", md: "80%" }}
            size={{ base: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
            color="accentTextColor"
        >
            {title}
        </Button>
    );
});
