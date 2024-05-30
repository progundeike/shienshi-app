import { Center, Spinner } from "@chakra-ui/react";
import { memo, FC } from "react";

export const LoadingPage: FC = memo(() => {
    return (
        <>
            <Center m="20px">
                <Spinner size="xl" />
            </Center>
        </>
    );
});
