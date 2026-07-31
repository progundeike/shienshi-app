import { type UseToastOptions, useToast } from "@chakra-ui/react";

export const useChakraToast = () => {
    const toast = useToast();

    const showToastOnce = (options: UseToastOptions) => {
        const id = String(options.title ?? "toast");
        if (toast.isActive(id)) return;
        toast({
            id,
            ...options,
        });
    };

    const showServerErrorToast = (title: string) => {
        showToastOnce({
            title: title,
            description:
                "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    const showPublicUserErrorToast = (title: string) => {
        showToastOnce({
            title: title,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    const showSuccessToast = (title: string) => {
        showToastOnce({
            title: title,
            status: "success",
            duration: 5000,
            isClosable: false,
            position: "bottom-right",
        });
    };

    const showWarningToast = (title: string) => {
        showToastOnce({
            title: title,
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    return {
        showServerErrorToast,
        showSuccessToast,
        showWarningToast,
        showPublicUserErrorToast,
    };
};
