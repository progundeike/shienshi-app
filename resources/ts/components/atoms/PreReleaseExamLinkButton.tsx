import { Button, Tooltip } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    children: ReactNode;
    url: string;
};

export const PreReleaseExamLinkButton: FC<Props> = memo(({ children, url }) => {
    return (
        <Tooltip label="制作中です" hasArrow>
            <Button backgroundColor="gray.300" w="80%">
                {children}
            </Button>
        </Tooltip>
    );
});
