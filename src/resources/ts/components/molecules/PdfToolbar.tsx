import {
    Box,
    Button,
    Flex,
    IconButton,
    Slider,
    SliderThumb,
    SliderTrack,
    Text,
} from "@chakra-ui/react";
import { FC, memo, useRef } from "react";
import { FiMousePointer } from "react-icons/fi";
import { LuEraser } from "react-icons/lu";
import type { MarkerTool } from "../../types/PdfMarker";
import { MARKER_COLORS } from "../../types/PdfMarker";

type Props = {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    onZoomChangeEnd: (zoom: number) => void;

    tool: MarkerTool;
    onToolChange: (tool: MarkerTool) => void;

    markerSize: number;
    onMarkerSizeChange: (size: number) => void;

    onClear: () => void;
};

const toolButtonStyles = {
    bg: "#17477D",
    color: "white",
    border: "1px solid",
    borderColor: "gray.500",
    borderRadius: "4px",
    boxSize: "30px",
    minW: "30px",
    flexShrink: 0,
    _hover: { bg: "#20588F" },
    _active: { bg: "#123860" },
    _focusVisible: {
        outline: "2px solid",
        outlineColor: "blue.400",
        outlineOffset: "3px",
    },
} as const;

const MARKER_BUTTONS = [
    { tool: "red", label: "赤のマーカー", color: MARKER_COLORS.red },
    { tool: "blue", label: "青のマーカー", color: MARKER_COLORS.blue },
    { tool: "yellow", label: "黄のマーカー", color: MARKER_COLORS.yellow },
] as const;

const ZOOM_KEYS = new Set([
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "Home", "End", "PageUp", "PageDown",
]);

export const PdfToolbar: FC<Props> = memo(
    ({
        zoom,
        onZoomChange,
        onZoomChangeEnd,
        tool,
        onToolChange,
        markerSize,
        onMarkerSizeChange,
        onClear,
    }) => {
        const keyboardZoomActive = useRef(false);
        const latestZoom = useRef(zoom);
        latestZoom.current = zoom;

        const commitKeyboardZoom = () => {
            keyboardZoomActive.current = false;
            onZoomChangeEnd(latestZoom.current);
        };

        return (
            <Flex
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
                gap={4}
                px={2}
                py={2}
                borderBottomWidth={1}
                borderColor="gray.200"
                bg="white"
            >
                {/* PDFサイズ変更のスライダー */}
                <Box flexShrink={0}>
                    <Flex align="center" gap={3}>
                        <Text whiteSpace="nowrap" fontSize="sm">
                            拡大・縮小
                        </Text>
                        <Slider
                            aria-label="PDFの拡大率"
                            min={50}
                            max={200}
                            step={10}
                            value={zoom}
                            onChange={(value) => {
                                latestZoom.current = value;
                                onZoomChange(value);
                            }}
                            onChangeEnd={(value) => {
                                // キー操作はキーを離した時、ポインターはドラッグ終了時に確定する。
                                if (!keyboardZoomActive.current) onZoomChangeEnd(value);
                            }}
                            w="160px"
                            flexShrink={0}
                        >
                            <SliderTrack
                                h="4px"
                                bg="gray.200"
                                border="1px solid"
                                borderColor="gray.300"
                                borderRadius={0}
                            />

                            <SliderThumb
                                onKeyDownCapture={(event) => {
                                    if (ZOOM_KEYS.has(event.key)) keyboardZoomActive.current = true;
                                }}
                                onKeyUp={(event) => {
                                    if (ZOOM_KEYS.has(event.key)) commitKeyboardZoom();
                                }}
                                onBlur={commitKeyboardZoom}
                                boxSize="22px"
                                bg="#17477D"
                                border="1px solid"
                                borderColor="gray.300"
                                boxShadow="none"
                                _focusVisible={{
                                    outline: "2px solid",
                                    outlineColor: "blue.400",
                                    outlineOffset: "3px",
                                }}
                            />
                        </Slider>

                        <Text minW="5ch" textAlign="right" fontSize="sm">
                            {zoom}%
                        </Text>
                    </Flex>
                </Box>

                {/* マーカー選択エリア */}
                <Flex align="center" gap={2} flexShrink={0}>
                    <IconButton
                        {...toolButtonStyles}
                        type="button"
                        aria-label="通常操作"
                        aria-pressed={tool === "pointer"}
                        icon={<FiMousePointer size={20} />}
                        boxShadow={
                            tool === "pointer"
                                ? "inset 0 0 0 3px #FFFF00"
                                : "none"
                        }
                        onClick={() => onToolChange("pointer")}
                    />

                    {MARKER_BUTTONS.map(({ tool: colorTool, label, color }) => (
                        <IconButton
                            {...toolButtonStyles}
                            key={colorTool}
                            type="button"
                            aria-label={label}
                            aria-pressed={tool === colorTool}
                            icon={
                                <Box
                                    boxSize="17px"
                                    borderRadius="full"
                                    bg={color}
                                />
                            }
                            boxShadow={
                                tool === colorTool
                                    ? "inset 0 0 0 3px #FFFF00"
                                    : "none"
                            }
                            onClick={() => onToolChange(colorTool)}
                        />
                    ))}

                    <IconButton
                        {...toolButtonStyles}
                        type="button"
                        aria-label="消しゴム"
                        aria-pressed={tool === "eraser"}
                        icon={<LuEraser size={20} />}
                        boxShadow={
                            tool === "eraser"
                                ? "inset 0 0 0 3px #FFFF00"
                                : "none"
                        }
                        onClick={() => onToolChange("eraser")}
                    />

                    <Text fontSize="sm" whiteSpace="nowrap" ml={1}>
                        サイズ
                    </Text>

                    <Slider
                        aria-label="マーカーの太さ"
                        getAriaValueText={(value) => `${value.toFixed(1)}倍`}
                        min={0.5}
                        max={3}
                        step={0.1}
                        value={markerSize}
                        onChange={onMarkerSizeChange}
                        w="80px"
                        flexShrink={0}
                    >
                        <SliderTrack
                            h="4px"
                            bg="gray.200"
                            border="1px solid"
                            borderColor="gray.300"
                            borderRadius={0}
                        />
                        <SliderThumb
                            boxSize="22px"
                            bg="#17477D"
                            border="1px solid"
                            borderColor="gray.300"
                            boxShadow="none"
                            _focusVisible={{
                                outline: "2px solid",
                                outlineColor: "blue.400",
                                outlineOffset: "3px",
                            }}
                        />
                    </Slider>

                    <Text fontSize="sm" minW="4ch" textAlign="right">
                        {markerSize.toFixed(1)}x
                    </Text>

                    <Button
                        {...toolButtonStyles}
                        type="button"
                        w="auto"
                        px={2}
                        fontWeight="normal"
                        aria-label="全ページのマーカーを一括クリア"
                        title="全ページのマーカーを削除します（取り消し不可）"
                        onClick={onClear}
                    >
                        クリア
                    </Button>
                </Flex>
            </Flex>
        );
    },
);
