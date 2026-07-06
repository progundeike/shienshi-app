import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Dialogue } from "../../types/form";

type Props = {
    dialogue: Dialogue;
};

export const DialogueBox: FC<Props> = memo((props) => {
    const { dialogue } = props;

    const bgColor = dialogue.role === "user" ? "green.100" : "blue.100";
    const margin =
        dialogue.role === "user"
            ? "10px 10px 10px auto"
            : "10px auto 10px 10px";

    return (
        <Box
            bg={bgColor}
            borderRadius="10px"
            p="10px"
            m={margin}
            maxW="90%"
            whiteSpace="pre-wrap"
        >
            {dialogue.content}
        </Box>
    );
});
