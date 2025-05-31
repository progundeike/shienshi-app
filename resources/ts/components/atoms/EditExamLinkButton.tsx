import { Button } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    children: ReactNode;
    url: string;
};

export const EditExamLinkButton: FC<Props> = memo(({ children, url }) => {
    return (
        <Link to={"/admin/edit/" + url}>
            <Button backgroundColor="red.300" w="80%">
                {children}
            </Button>
        </Link>
    );
});
