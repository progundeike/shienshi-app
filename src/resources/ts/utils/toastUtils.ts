import { UseToastOptions, useToast } from "@chakra-ui/react";

export const useChakraToast = () => {
    const toast = useToast();

    const showServerErrorToast = (title: string): UseToastOptions => ({
        title: title,
        description:
            "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
    });

    const showSuccessToast = (title: string) => {
        toast({
            title: title,
            status: "success",
            duration: 6000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    return { showServerErrorToast, showSuccessToast };
};
