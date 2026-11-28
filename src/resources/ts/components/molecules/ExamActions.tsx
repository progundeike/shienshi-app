import { Button, Flex } from "@chakra-ui/react";
import { memo, type FC } from "react";

type Props = {
    onOpenQuestionWindow?: () => void;
    onOpenMemo?: () => void;
};

export const ExamActions: FC<Props> = memo(
    ({ onOpenQuestionWindow, onOpenMemo }) => {
        const actions = [
            {
                label: "問題（別画面）",
                onClick: onOpenQuestionWindow,
                bg: "#009900",
                color: "white",
                hoverBg: "#008000",
            },
            {
                label: "メモ",
                onClick: onOpenMemo,
                bg: "#DEDEDE",
                color: "#333333",
                hoverBg: "#ECECEC",
            },
        ];

        return (
            <Flex
                role="group"
                aria-label="試験問題の操作"
                alignItems="center"
                justifyContent="flex-start"
                gap={2}
                flexWrap="wrap"
                flexShrink={0}
            >
                {actions.map(({ label, onClick, bg, color, hoverBg }) => (
                    <Button
                        key={label}
                        type="button"
                        size="sm"
                        minW="60px"
                        h="32px"
                        px={4}
                        flexShrink={0}
                        bg={bg}
                        color={color}
                        border="2px solid"
                        borderColor="#999999"
                        borderRadius="full"
                        boxShadow="0 1px 1px rgb(0 0 0 / 15%)"
                        fontSize="sm"
                        fontWeight="medium"
                        isDisabled={!onClick}
                        title={onClick ? undefined : "準備中"}
                        onClick={onClick}
                        _hover={{ bg: hoverBg }}
                        _active={{ bg: hoverBg, boxShadow: "inset 0 1px 2px rgb(0 0 0 / 20%)" }}
                        // 動作を接続するまでは無効だが、配色は確認できるようにする。
                        _disabled={{ opacity: 1, cursor: "not-allowed" }}
                        _focusVisible={{
                            outline: "2px solid",
                            outlineColor: "blue.400",
                            outlineOffset: "3px",
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </Flex>
        );
    },
);
