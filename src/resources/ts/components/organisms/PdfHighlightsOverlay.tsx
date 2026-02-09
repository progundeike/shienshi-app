import { Box } from "@chakra-ui/react";
import type { Highlight } from "../../hooks/usePdfHighlights";
import { FC } from "react";

export type NormRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type AreaHighlight = {
    id: string;
    page: number;
    rect: NormRect;
};

type Props = {
    highlights: AreaHighlight[];
    page: number;
    ghost?: { page: number; rect: NormRect } | null;
    onDelete?: (id: string) => void;
};

// ハイライトの描画だけを担当するコンポーネント
export const PdfHighlightsOverlay: FC<Props> = ({
    highlights,
    page,
    ghost,
    onDelete,
}) => {
    return (
        <Box position="absolute" inset={0} pointerEvents="none" zIndex={10}>
            {ghost?.page === page && (
                <Box
                    position="absolute"
                    left={`${ghost.rect.x * 100}%`}
                    top={`${ghost.rect.y * 100}%`}
                    width={`${ghost.rect.w * 100}%`}
                    height={`${ghost.rect.h * 100}%`}
                    bg="rgba(255, 226, 143, 0.6)"
                    outline="2px dashed rgba(180, 140, 0, 0.5)"
                />
            )}
            {highlights
                .filter((h) => h.page === page)
                .map((h) => (
                    <Box
                        key={h.id}
                        position="absolute"
                        left={`${h.rect.x * 100}%`}
                        top={`${h.rect.y * 100}%`}
                        width={`${h.rect.w * 100}%`}
                        height={`${h.rect.h * 100}%`}
                        bg="rgba(255, 226, 143, 0.5)"
                        pointerEvents="auto"
                        cursor="pointer"
                        onClick={() => onDelete?.(h.id)}
                    />
                ))}
        </Box>
    );
};
