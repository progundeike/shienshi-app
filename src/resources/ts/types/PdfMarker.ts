export const MARKER_COLORS = {
    red: "#FF0000",
    blue: "#0000FF",
    yellow: "#FFFF00",
} as const;

export type MarkerColor = keyof typeof MARKER_COLORS;

export type MarkerTool = "pointer" | MarkerColor | "eraser";

export type MarkerPoint = {
    // ページの幅・高さに対する割合
    x: number;
    y: number;
};

export type MarkerStroke = {
    tool: MarkerColor;
    // ページ幅に対する線の太さの割合
    width: number;
    points: MarkerPoint[];
};
