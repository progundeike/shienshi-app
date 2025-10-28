import { Button } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    children: ReactNode;
    url: string;
    color: string;
};

export const EditExamLinkButton: FC<Props> = memo(
    ({ children, url, color }) => {
        return (
            <Link to={"/admin/edit/" + url}>
                <Button colorScheme={color} w="80%">
                    {children}
                </Button>
            </Link>
        );
    }
);
