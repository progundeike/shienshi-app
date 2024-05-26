import { Box } from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { pdfjs } from "react-pdf";

// Workerのパスを設定
pdfjs.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

const url =
    "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";

export const ExamsPage: FC = memo(() => {
    useEffect(() => {
        const loadPdf = async () => {
            try {
                // PDFの非同期ダウンロード
                const loadingTask = pdfjs.getDocument(url);
                const pdf = await loadingTask.promise;
                console.log("PDF loaded");

                // 最初のページを取得
                const pageNumber = 1;
                const page = await pdf.getPage(pageNumber);
                console.log("Page loaded");

                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                // canvasの準備
                const canvas = document.getElementById(
                    "the-canvas"
                ) as HTMLCanvasElement;
                const context = canvas.getContext("2d");
                if (context) {
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // PDFページをcanvasにレンダリング
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    const renderTask = page.render(renderContext);
                    await renderTask.promise;
                    console.log("Page rendered");
                }
            } catch (reason) {
                console.error("Error loading PDF:", reason);
            }
        };

        loadPdf();
    }, []);

    return (
        <Box>
            <h1>PDF.js 'Hello, world!' example</h1>
            <p>
                Please use{" "}
                <a href="https://mozilla.github.io/pdf.js/getting_started/#download">
                    <i>official releases</i>
                </a>{" "}
                in production environments.
            </p>
            <canvas id="the-canvas"></canvas>
        </Box>
    );
});
