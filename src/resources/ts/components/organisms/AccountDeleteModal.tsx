import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    useDisclosure,
    Flex,
    Box,
    Spinner,
    Icon,
    Center,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from "@chakra-ui/react";
import { FC, memo } from "react";
import { GoAlert } from "react-icons/go";

import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AccountDeleteFormInput } from "../../types/form";

export const AccountDeleteModal: FC = memo(() => {
    const { deleteUser } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid, isSubmitting },
    } = useForm<AccountDeleteFormInput>({
        mode: "onChange",
        defaultValues: {
            password: "",
        },
    });

    const onDelete = async (data: AccountDeleteFormInput) => {
        try {
            await deleteUser(data.password);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setError("password", {
                    type: "server",
                    message:
                        error.response.data.errors?.password?.[0] ??
                        "パスワードが正しくありません",
                });
            }
        }
    };

    return (
        <Box>
            <Box textAlign="center" mt={10} mb={5}>
                <Text
                    fontSize={{ base: "sm", md: "md" }}
                    cursor="pointer"
                    onClick={onOpen}
                    display="inline-block"
                    _hover={{ textDecoration: "underline" }}
                >
                    アカウントの削除はこちら
                </Text>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    w={{ base: "90%", md: "400px" }}
                    textAlign="center"
                    borderRadius="xl"
                >
                    <ModalHeader m="auto">アカウントを削除</ModalHeader>
                    <ModalBody>
                        <Center mb={5}>
                            <Icon as={GoAlert} color="red.500" boxSize="30%" />
                        </Center>
                        <Box textAlign="center" mb={5}>
                            <Text>
                                削除したアカウントの内容は復元できません
                            </Text>
                        </Box>

                        <Box w="80%" mx="auto" my={2}>
                            <form onSubmit={handleSubmit(onDelete)}>
                                <Flex direction="column" gap={3}>
                                    <FormControl
                                        isRequired
                                        isInvalid={!!errors.password}
                                    >
                                        <FormLabel>
                                            パスワードを入力してください
                                        </FormLabel>
                                        <Input
                                            type="password"
                                            autoComplete="current-password"
                                            {...register("password", {
                                                required:
                                                    "パスワードを入力してください。",
                                            })}
                                        />
                                        <FormErrorMessage>
                                            {errors.password?.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        isLoading={isSubmitting}
                                        isDisabled={!isValid || isSubmitting}
                                        backgroundColor="red.500"
                                        color="white"
                                        borderRadius="full"
                                        w="100%"
                                        shadow="md"
                                    >
                                        アカウントを削除する
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        borderRadius="full"
                                    >
                                        もどる
                                    </Button>
                                </Flex>
                            </form>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
});
