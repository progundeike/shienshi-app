import { Button } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    children: ReactNode;
    url: string;
};

export const ExamLinkButton: FC<Props> = memo(({ children, url }) => {
    return (
        <Button
            as={Link}
            to={"/exams/" + url}
            backgroundColor="accentColor"
            w="80%"
            color="accentTextColor"
        >
            {children}
        </Button>
    );
});
