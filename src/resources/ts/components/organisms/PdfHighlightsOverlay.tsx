import { Box } from "@chakra-ui/react";
import type { Highlight } from "../../hooks/usePdfHighlights";

export const PdfHighlightsOverlay = ({
    highlights,
    page,
}: {
    highlights: Highlight[];
    page: number;
}) => {
    return (
        <Box position="absolute" inset={0} pointerEvents="none" zIndex={10}>
            {highlights
                .filter((h) => h.page === page)
                .flatMap((h) =>
                    h.rects.map((r, i) => (
                        <Box
                            key={`${h.id}_${h.page}_${i}`}
                            position="absolute"
                            left={`${r.x * 100}%`}
                            top={`${r.y * 100}%`}
                            width={`${r.w * 100}%`}
                            height={`${r.h * 100}%`}
                            bg="yellow.200"
                            opacity={0.55}
                            borderRadius="2px"
                        />
                    )),
                )}
        </Box>
    );
};
