import { UseToastOptions, useToast } from "@chakra-ui/react";

export const useChakraToast = () => {
    const toast = useToast();

    // 予期しないサーバーエラー
    const unexpectedServerErrorToast: UseToastOptions = {
        title: "サーバーエラー",
        description: "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
    };

    return { toast, unexpectedServerErrorToast };
}
