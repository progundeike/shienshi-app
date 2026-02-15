import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    list,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
import { SubmitHandler, useForm, Controller, set } from "react-hook-form";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NewsItem } from "../../../types/form";
import { useNewsItem } from "../../../hooks/useNewsItem";

export const NewsItemPage: FC = memo(() => {
    const [selectedNewsItem, setSelectedNewsItem] = useState<null | NewsItem>(
        null,
    );
    const { newsItemList, updateNewsItem, deleteNewsItem } = useNewsItem();
    const newsItems = newsItemList.data ?? [];

    const handleSaveNewsItem: SubmitHandler<NewsItem> = async (data) => {
        try {
            await updateNewsItem.mutateAsync(data);
            onClose();
        } catch (err) {
            const errors = err as AxiosError<any>;
            if (
                errors.response?.status === 422 &&
                errors.response.data?.errors
            ) {
                Object.entries(errors.response.data.errors).forEach(
                    ([field, messages]) => {
                        setError(field as keyof NewsItem, {
                            type: "server",
                            message:
                                (messages as string[])[0] ??
                                "入力内容をご確認ください",
                        });
                    },
                );
            }
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toLocalInput = (dateInput: string | Date): string => {
        const date = new Date(dateInput);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setError,
        control,
    } = useForm<NewsItem>({
        defaultValues: {
            id: undefined,
            title: "",
            content: "",
            published_at: "",
        },
    });

    const handleOpenCreate = () => {
        setSelectedNewsItem(null);
        reset({
            id: undefined,
            title: "",
            content: "",
            published_at: toLocalInput(new Date()),
        });
        onOpen();
    };

    const handleOpenEdit = (item: NewsItem) => {
        setSelectedNewsItem(item);
        reset({
            id: item.id,
            title: item.title,
            content: item.content,
            published_at: toLocalInput(item.published_at),
        });
        onOpen();
    };

    const handleDelete = async (item: NewsItem) => {
        if (selectedNewsItem) {
            await deleteNewsItem.mutateAsync(selectedNewsItem.id!);
            onClose();
        }
    };

    return (
        <Box w="80%" mx="auto" my="50px" textAlign="center">
            <Heading>お知らせ編集</Heading>
            <Button
                w="50%"
                my="20px"
                colorScheme="green"
                onClick={handleOpenCreate}
                borderRadius="full"
            >
                お知らせ追加
            </Button>
            <Box>
                <Box
                    maxH="300px"
                    overflowY="auto"
                    mt="10px"
                    border="1px solid"
                    borderColor="#CCCCCC"
                    borderRadius="5px"
                    sx={{ scrollbarGutter: "stable" }}
                >
                    {newsItems.map((item: any) => (
                        <Box
                            key={item.id}
                            borderBottom="1px Solid #CCCCCC"
                            p="5px"
                        >
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Flex
                                    direction="row"
                                    gap="20px"
                                    alignItems="center"
                                >
                                    <Box w="50px">
                                        {new Date(
                                            item.published_at,
                                        ).toLocaleDateString("ja-JP", {
                                            month: "numeric",
                                            day: "numeric",
                                            timeZone: "Asia/Tokyo",
                                        })}
                                    </Box>
                                    <Box>
                                        {item.content ? (
                                            <Accordion allowToggle>
                                                <AccordionItem
                                                    border="none"
                                                    padding="0"
                                                >
                                                    <AccordionButton p="10px">
                                                        <Box>
                                                            <Text>
                                                                {item.title}
                                                            </Text>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel pb={4}>
                                                        {item.content}
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            </Accordion>
                                        ) : (
                                            <Box p="10px">
                                                <Text size="sm">
                                                    {item.title}
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                </Flex>

                                <Box mr="10px">
                                    <Button
                                        colorScheme="red"
                                        borderRadius="full"
                                        onClick={() => handleOpenEdit(item)}
                                    >
                                        編集
                                    </Button>
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader m="auto">お知らせ追加・編集</ModalHeader>
                    <ModalBody mb="20px">
                        <Box>
                            <form onSubmit={handleSubmit(handleSaveNewsItem)}>
                                <Flex direction="column" gap="10px">
                                    <FormControl isInvalid={!!errors.title}>
                                        <FormLabel>タイトル</FormLabel>
                                        <Input {...register("title")} />
                                        <FormErrorMessage>
                                            {errors.title &&
                                                errors.title.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.content}>
                                        <FormLabel>内容</FormLabel>
                                        <Textarea {...register("content")} />
                                        <FormErrorMessage>
                                            {errors.content &&
                                                errors.content.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        isInvalid={!!errors.published_at}
                                    >
                                        <FormLabel>公開日時</FormLabel>
                                        <Input
                                            type="datetime-local"
                                            {...register("published_at")}
                                        />
                                        <FormErrorMessage>
                                            {errors.published_at &&
                                                errors.published_at.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Flex
                                        direction="row"
                                        // justifyContent="center"
                                        // alignItems="center"
                                        gap="20px"
                                    >
                                        <Button
                                            w="30%"
                                            m="auto"
                                            colorScheme="blue"
                                            mt="20px"
                                            type="submit"
                                            borderRadius="full"
                                            isLoading={updateNewsItem.isPending}
                                        >
                                            {selectedNewsItem ? "更新" : "追加"}
                                        </Button>

                                        {selectedNewsItem && (
                                            <Button
                                                w="30%"
                                                m="auto"
                                                mt="20px"
                                                borderRadius="full"
                                                onClick={() =>
                                                    handleDelete(
                                                        selectedNewsItem,
                                                    )
                                                }
                                                colorScheme="red"
                                            >
                                                {" "}
                                                削除
                                            </Button>
                                        )}
                                    </Flex>
                                </Flex>
                            </form>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
});
