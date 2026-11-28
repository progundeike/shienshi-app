import {
    memo,
    useCallback,
    useEffect,
    useRef,
    type FC,
    type PointerEvent as ReactPointerEvent,
} from "react";
import {
    MARKER_COLORS,
    type MarkerPoint,
    type MarkerStroke,
    type MarkerTool,
} from "../../types/PdfMarker";
import { isStrokeHit } from "../../utils/pdfMarkerGeometry";

type Props = {
    tool: MarkerTool;
    markerSize: number;
    zoom: number;
};

const PEN_WIDTH = 4;
const ERASER_WIDTH = 12;

export const PdfDrawingOverlay: FC<Props> = memo(
    ({ tool, markerSize, zoom }) => {
        const canvasRef = useRef<HTMLCanvasElement | null>(null);

        // 一筆ごとの線を保持する。消しゴムは対象の線そのものを削除する。
        const strokesRef = useRef<MarkerStroke[]>([]);

        // 現在描いている線
        const activeRef = useRef<{
            pointerId: number;
            stroke: MarkerStroke;
        } | null>(null);

        const erasingRef = useRef<{
            pointerId: number;
            previous: MarkerPoint;
            width: number;
        } | null>(null);

        const frameRef = useRef<number | null>(null);

        const redraw = useCallback(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;

            const dpr = window.devicePixelRatio || 1;
            const pixelWidth = Math.round(rect.width * dpr);
            const pixelHeight = Math.round(rect.height * dpr);

            if (canvas.width !== pixelWidth) {
                canvas.width = pixelWidth;
            }
            if (canvas.height !== pixelHeight) {
                canvas.height = pixelHeight;
            }

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, rect.width, rect.height);

            const drawStroke = (stroke: MarkerStroke) => {
                const first = stroke.points[0];
                if (!first) return;

                const color = MARKER_COLORS[stroke.tool];
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 0.5;
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.lineWidth = stroke.width * rect.width;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";

                ctx.beginPath();

                // クリックだけの場合も点として描く
                if (stroke.points.length === 1) {
                    ctx.arc(
                        first.x * rect.width,
                        first.y * rect.height,
                        ctx.lineWidth / 2,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                    return;
                }

                ctx.moveTo(first.x * rect.width, first.y * rect.height);

                for (let i = 1; i < stroke.points.length; i++) {
                    const point = stroke.points[i];
                    ctx.lineTo(point.x * rect.width, point.y * rect.height);
                }

                ctx.stroke();
            };

            strokesRef.current.forEach(drawStroke);

            if (activeRef.current) {
                drawStroke(activeRef.current.stroke);
            }
        }, []);

        // マウス移動のたびではなく、画面更新に合わせて描画する
        const requestRedraw = useCallback(() => {
            if (frameRef.current !== null) return;

            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;
                redraw();
            });
        }, [redraw]);

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const observer = new ResizeObserver(requestRedraw);
            observer.observe(canvas);
            requestRedraw();

            return () => {
                observer.disconnect();

                if (frameRef.current !== null) {
                    cancelAnimationFrame(frameRef.current);
                    frameRef.current = null;
                }
            };
        }, [requestRedraw]);

        const getPoint = (
            event: ReactPointerEvent<HTMLCanvasElement>,
            clamp = true,
        ): MarkerPoint => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            return clamp
                ? { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
                : { x, y };
        };

        const erase = (event: ReactPointerEvent<HTMLCanvasElement>) => {
            const erasing = erasingRef.current;
            if (!erasing || erasing.pointerId !== event.pointerId) return;

            const rect = event.currentTarget.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const next = getPoint(event, false);
            const remaining = strokesRef.current.filter((stroke) => !isStrokeHit(
                stroke, erasing.previous, next, erasing.width, rect.width, rect.height,
            ));
            erasing.previous = next;

            if (remaining.length !== strokesRef.current.length) {
                strokesRef.current = remaining;
                requestRedraw();
            }
        };

        const start = (event: ReactPointerEvent<HTMLCanvasElement>) => {
            if (
                tool === "pointer" ||
                event.button !== 0 ||
                !event.isPrimary ||
                activeRef.current ||
                erasingRef.current
            ) {
                return;
            }

            const rect = event.currentTarget.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;

            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);

            if (tool === "eraser") {
                erasingRef.current = {
                    pointerId: event.pointerId,
                    previous: getPoint(event, false),
                    width: (ERASER_WIDTH * markerSize * zoom) / 100 / rect.width,
                };
                erase(event);
                return;
            }

            activeRef.current = {
                pointerId: event.pointerId,
                stroke: {
                    tool,
                    width: (PEN_WIDTH * markerSize * zoom) / 100 / rect.width,
                    points: [getPoint(event, false)],
                },
            };

            requestRedraw();
        };

        const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
            if (erasingRef.current?.pointerId === event.pointerId) {
                event.preventDefault();
                erase(event);
                return;
            }
            const active = activeRef.current;
            if (!active || active.pointerId !== event.pointerId) return;

            event.preventDefault();
            active.stroke.points.push(getPoint(event, false));
            requestRedraw();
        };

        const finish = (event: ReactPointerEvent<HTMLCanvasElement>) => {
            if (erasingRef.current?.pointerId === event.pointerId) {
                erase(event);
                erasingRef.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
                return;
            }
            const active = activeRef.current;
            if (!active || active.pointerId !== event.pointerId) return;

            const last = getPoint(event, false);
            const previous =
                active.stroke.points[active.stroke.points.length - 1];

            if (last.x !== previous.x || last.y !== previous.y) {
                active.stroke.points.push(last);
            }

            strokesRef.current.push(active.stroke);
            activeRef.current = null;

            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }

            requestRedraw();
        };

        const cancel = (event: ReactPointerEvent<HTMLCanvasElement>) => {
            if (erasingRef.current?.pointerId === event.pointerId) {
                erasingRef.current = null;
            }
            if (activeRef.current?.pointerId !== event.pointerId) return;

            activeRef.current = null;
            requestRedraw();
        };

        return (
            <canvas
                ref={canvasRef}
                aria-label="PDFへの書き込み領域"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    pointerEvents: tool === "pointer" ? "none" : "auto",
                    touchAction: tool === "pointer" ? "auto" : "none",
                    cursor: tool === "pointer" ? "default" : "crosshair",
                }}
                onPointerDown={start}
                onPointerMove={move}
                onPointerUp={finish}
                onPointerCancel={cancel}
                onLostPointerCapture={cancel}
            />
        );
    },
);
