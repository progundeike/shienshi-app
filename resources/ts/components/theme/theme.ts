import { extendTheme } from "@chakra-ui/react";
import { Component } from "react";

export const theme = extendTheme({
    styles: {
        global: {
            body: {
                backgroundColor: "gray.100",
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
                backgroundColor: "gray.300",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50%"
            },
            ".gutter.gutter-horizontal": {
                backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
                cursor: "col-resize",
            },
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
    },
});