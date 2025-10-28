import { FC, ReactNode } from "react";
// import { HeadBlock } from "../template/HeadBlock";
import {
    Box,
    Heading,
    ListItem,
    Text,
    OrderedList,
    Flex,
    Link,
    Spacer,
} from "@chakra-ui/react";

const CustomHeading: FC<{ children: string }> = ({ children }) => (
    <Heading size="md" mb="10px">
        {children}
    </Heading>
);

const CustomList: FC<{ children: ReactNode }> = ({ children }) => (
    <OrderedList spacing={2}>{children}</OrderedList>
);

const CustomFlex: FC<{ children: ReactNode }> = ({ children }) => (
    <Flex direction="column" gap={2}>
        {children}
    </Flex>
);

const NestList: FC<{ children: ReactNode }> = ({ children }) => (
    <Box my="10px">
        <CustomList>{children}</CustomList>
    </Box>
);

export const TermsPage: FC = () => {
    return (
        <>
            {/* <HeadBlock title="利用規約" /> */}

            <Flex direction="column" gap="30px" mb="30px">
                ここに利用規約を記載する
            </Flex>
        </>
    );
};
