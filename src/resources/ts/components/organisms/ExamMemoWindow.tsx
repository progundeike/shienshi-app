import {
    Box, Button, CloseButton, Flex, Portal, Text, Textarea,
} from "@chakra-ui/react";
import {
    useEffect, useRef, useState,
    type KeyboardEvent, type PointerEvent,
} from "react";
import {
    clampMemoPosition, readExamMemo, saveExamMemo, type MemoPosition,
} from "../../utils/examMemo";

type Props = {
    storageKey: string;
    isOpen: boolean;
    onClose: () => void;
};

const MEMO_VISIBLE_LINES = 14;
const MEMO_LINE_HEIGHT_REM = 1.5;

// 親で storageKey を key に指定し、試験変更時に別のメモとして初期化する。
export const ExamMemoWindow = ({ storageKey, isOpen, onClose }: Props) => {
    const [initialMemo] = useState(() => readExamMemo(storageKey));
    const [text, setText] = useState(initialMemo.text);
    const [saveFailed, setSaveFailed] = useState(initialMemo.failed);
    const [isTranslucent, setIsTranslucent] = useState(false);
    const [position, setPosition] = useState<MemoPosition>({ x: 24, y: 80 });
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        position: MemoPosition;
    } | null>(null);

    const constrain = (next: MemoPosition) => {
        const rect = panelRef.current?.getBoundingClientRect();
        return rect
            ? clampMemoPosition(next, rect.width, rect.height, window.innerWidth, window.innerHeight)
            : next;
    };

    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement;
        inputRef.current?.focus({ preventScroll: true });
        const fit = () => {
            // モバイルへ切り替わる瞬間のresizeでは、PCでの位置を変更しない。
            const rect = panelRef.current?.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) return;
            setPosition((current) => constrain(current));
        };
        fit();
        const observer = new ResizeObserver(fit);
        if (panelRef.current) observer.observe(panelRef.current);
        window.addEventListener("resize", fit);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", fit);
            dragRef.current = null;
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
                previousFocus.focus({ preventScroll: true });
            }
        };
    }, [isOpen]);

    const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0 || !event.isPrimary || dragRef.current) return;
        event.preventDefault();
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            position,
        };
    };

    const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        event.preventDefault();
        setPosition(constrain({
            x: drag.position.x + event.clientX - drag.startX,
            y: drag.position.y + event.clientY - drag.startY,
        }));
    };

    const stopDrag = (event: PointerEvent<HTMLButtonElement>) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const moveWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
        const step = event.shiftKey ? 50 : 10;
        const offsets: Record<string, MemoPosition> = {
            ArrowLeft: { x: -step, y: 0 },
            ArrowRight: { x: step, y: 0 },
            ArrowUp: { x: 0, y: -step },
            ArrowDown: { x: 0, y: step },
        };
        const offset = offsets[event.key];
        if (!offset) return;
        event.preventDefault();
        setPosition((current) => constrain({ x: current.x + offset.x, y: current.y + offset.y }));
    };

    // 非表示でも本文の状態は保持する。画面全体のオーバーレイやフォーカストラップは置かない。
    return (
        <Portal>
            <Flex
                ref={panelRef}
                role="dialog"
                aria-label="試験メモ"
                aria-modal={false}
                display={isOpen ? { base: "none", md: "flex" } : "none"}
                position="fixed"
                left={`${position.x}px`}
                top={`${position.y}px`}
                zIndex="popover"
                direction="column"
                w="360px"
                maxW="100vw"
                // 本文14行に、ヘッダー41pxと外枠・入力欄の上下border計4pxを加える。
                h={`calc(${MEMO_VISIBLE_LINES * MEMO_LINE_HEIGHT_REM}rem + 45px)`}
                maxH="100dvh"
                border="1px solid"
                borderColor="gray.500"
                borderRadius="md"
                boxShadow="lg"
                overflow="hidden"
                bg={isTranslucent ? "rgba(255,255,255,0.7)" : "white"}
                onKeyDown={(event) => {
                    if (event.key === "Escape" && !event.nativeEvent.isComposing) {
                        event.stopPropagation();
                        onClose();
                    }
                }}
            >
                <Flex align="center" gap={2} px={2} py={1} flexShrink={0} borderBottomWidth={1} borderColor="gray.400">
                    <Button
                        type="button"
                        variant="unstyled"
                        size="sm"
                        flex={1}
                        minW={0}
                        h="auto"
                        minH="32px"
                        whiteSpace="normal"
                        lineHeight="short"
                        textAlign="left"
                        cursor="move"
                        style={{ touchAction: "none" }}
                        userSelect="none"
                        aria-label="メモを移動（ドラッグまたは矢印キー）"
                        onPointerDown={startDrag}
                        onPointerMove={moveDrag}
                        onPointerUp={stopDrag}
                        onPointerCancel={stopDrag}
                        onLostPointerCapture={stopDrag}
                        onKeyDown={moveWithKeyboard}
                    >
                        メモ
                        <Text as="span" ml={1} fontSize="xs" fontWeight="normal" color="gray.700">
                            (タブを閉じると消去されます)
                        </Text>
                    </Button>
                    <Button
                        type="button"
                        size="xs"
                        flexShrink={0}
                        variant="outline"
                        aria-pressed={isTranslucent}
                        onClick={() => setIsTranslucent((value) => !value)}
                    >
                        半透明{isTranslucent ? "：ON" : "：OFF"}
                    </Button>
                    <CloseButton size="sm" aria-label="メモを閉じる" onClick={onClose} />
                </Flex>
                <Box flex={1} minH={0}>
                    <Textarea
                        ref={inputRef}
                        aria-label="メモ本文"
                        placeholder="演習中のメモを入力できます"
                        value={text}
                        onChange={(event) => {
                            const next = event.target.value;
                            setText(next);
                            setSaveFailed(!saveExamMemo(storageKey, next));
                        }}
                        h="100%"
                        resize="none"
                        bg="transparent"
                        color="gray.900"
                        fontSize="sm"
                        py={0}
                        px="4px"
                        borderRadius={0}
                        sx={{
                            // 行間と罫線を同じ値で管理し、スクロール時も一緒に動かす。
                            "--memo-line-height": `${MEMO_LINE_HEIGHT_REM}rem`,
                            lineHeight: "var(--memo-line-height)",
                            backgroundImage: "linear-gradient(to bottom, transparent calc(var(--memo-line-height) - 1px), #D1D5DB 1px)",
                            backgroundSize: "100% var(--memo-line-height)",
                            // 文字の左右余白にも罫線を描き、枠の端まで広げる。
                            backgroundOrigin: "padding-box",
                            backgroundClip: "padding-box",
                            backgroundAttachment: "local",
                        }}
                    />
                </Box>
                {saveFailed && (
                    <Text px={3} pb={2} fontSize="xs" color="red.700" role="status">
                        一時保存できません。再読み込みすると内容が失われます。
                    </Text>
                )}
            </Flex>
        </Portal>
    );
};
