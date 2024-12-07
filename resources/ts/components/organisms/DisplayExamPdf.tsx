import { FC, memo, useMemo, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useParams } from "react-router-dom";

type Props = {
    leftPanelWidth: number;
};

export const DisplayExamPdf: FC<Props> = memo((props) => {
    const { leftPanelWidth } = props;
    const [numPages, setNumPages] = useState(1);
    const { year, season, section } = useParams();
    // Workerのパスを設定　現在はCDNを使用
    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

    const url = useMemo(
        () =>
            `http://${window.location.host}/storage/pdf/${year}_${season}_${section}.pdf`,
        []
    );

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={leftPanelWidth}
                    />
                ))}
            </Document>
        </>
    );
});
