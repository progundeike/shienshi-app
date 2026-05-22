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
                backgroundColor="gray.300"
                w="80%"
                size={{ base: "sm", md: "md" }}
                px={{ base: 2, md: 4 }}
            >
                {title}
            </Button>
        </Tooltip>
    );
});
