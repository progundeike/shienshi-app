import { Box, Heading } from "@chakra-ui/react";
import { LuBell } from "react-icons/lu";
import { DisplayNewsItemList } from "./DisplayNewsItemList";
import { memo } from "react";

export const NewsItemSection = memo(() => {
    return (
        <Box
            backgroundColor="white"
            borderRadius={5}
            border="1px solid"
            borderColor="#CCCCCC"
            textAlign="left"
            shadow="md"
            p={{ base: 4, md: 7 }}
            w="100%"
        >
            <Box mb={5}>
                <Heading size={{ base: "sm", md: "lg" }} color="baseColor">
                    <LuBell
                        style={{
                            display: "inline",
                            marginBottom: "-4px",
                            marginRight: 2,
                        }}
                    />
                    お知らせ
                </Heading>
            </Box>
            <DisplayNewsItemList />
        </Box>
    );
});
