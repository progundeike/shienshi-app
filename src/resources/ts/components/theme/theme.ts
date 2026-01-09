import { extendTheme } from "@chakra-ui/react";
import { Component } from "react";

export const theme = extendTheme({
    colors: {
        // baseColor:  '#003366',
        baseColor:  '#1e3a8a',
        subColor: '#3b82f6',
        baseTextColor: 'white',
        accentColor: '#3CB371',
        accentTextColor: 'white',
    },
    styles: {
        global: {
            body: {
                backgroundColor: "#F0F4F8",
                color: "gray.800",
            },
            ".hiddenCanvasElement": {
                display: "none !important",
            },
            ".split": {
                display: "flex",
                flexDirection: "row",
            },
            ".gutter": {
                cursor: "col-resize",
                backgroundColor: "#F5F5F5",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50%",
                },
            ".gutter.gutter-horizontal": {
                backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50%",
            },
        },
    components: {
        Table: {
            baseStyle: {
                td: {
                    textAlign: "center",
                },
            },
        },
    },}
});