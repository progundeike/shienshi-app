import type { MarkerPoint, MarkerStroke } from "../types/PdfMarker";

const pointSegmentDistanceSquared = (
    point: MarkerPoint,
    start: MarkerPoint,
    end: MarkerPoint,
) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared === 0
        ? 0
        : Math.max(0, Math.min(1,
            ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
        ));
    return (point.x - start.x - t * dx) ** 2
        + (point.y - start.y - t * dy) ** 2;
};

const segmentDistanceSquared = (
    a: MarkerPoint,
    b: MarkerPoint,
    c: MarkerPoint,
    d: MarkerPoint,
) => {
    const rx = b.x - a.x;
    const ry = b.y - a.y;
    const sx = d.x - c.x;
    const sy = d.y - c.y;
    const cross = rx * sy - ry * sx;

    if (cross !== 0) {
        const qx = c.x - a.x;
        const qy = c.y - a.y;
        const t = (qx * sy - qy * sx) / cross;
        const u = (qx * ry - qy * rx) / cross;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return 0;
    }

    return Math.min(
        pointSegmentDistanceSquared(a, c, d),
        pointSegmentDistanceSquared(b, c, d),
        pointSegmentDistanceSquared(c, a, b),
        pointSegmentDistanceSquared(d, a, b),
    );
};

// 消しゴムの移動区間で判定し、速く動かしても途中の線を取りこぼさない。
// 座標・太さはページに対する割合で受け取り、表示上の距離へ変換する。
export const isStrokeHit = (
    stroke: MarkerStroke,
    from: MarkerPoint,
    to: MarkerPoint,
    eraserWidth: number,
    pageWidth: number,
    pageHeight: number,
): boolean => {
    if (stroke.points.length === 0) return false;

    const toPixels = (point: MarkerPoint): MarkerPoint => ({
        x: point.x * pageWidth,
        y: point.y * pageHeight,
    });
    const a = toPixels(from);
    const b = toPixels(to);
    const radiusSquared = ((stroke.width + eraserWidth) * pageWidth / 2) ** 2;

    if (stroke.points.length === 1) {
        return pointSegmentDistanceSquared(toPixels(stroke.points[0]), a, b)
            <= radiusSquared;
    }

    for (let i = 1; i < stroke.points.length; i++) {
        if (segmentDistanceSquared(
            a, b, toPixels(stroke.points[i - 1]), toPixels(stroke.points[i]),
        ) <= radiusSquared) return true;
    }
    return false;
};
