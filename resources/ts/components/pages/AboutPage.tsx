import React from "react";
import { Box } from "@chakra-ui/react";
import Split from "react-split";

export const AboutPage = () => {
    return (
        <Box height="100vh">
            <Split
                sizes={[50, 50]}
                minSize={100}
                gutterSize={10}
                gutterAlign="center"
                direction="horizontal"
                style={{ display: "flex", height: "100%" }} // Splitコンテナにスタイルを追加
            >
                <Box bg="blue.100" padding="4" height="100%">
                    左のコンポーネント
                </Box>
                <Box bg="green.100" padding="4" height="100%">
                    右のコンポーネント
                </Box>
            </Split>
        </Box>
    );
};
