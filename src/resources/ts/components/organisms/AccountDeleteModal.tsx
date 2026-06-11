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
} from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { IoAlertCircle } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { FaRegCheckCircle } from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { loadingAtom } from "../../states/loadingAtom";

export const AccountDeleteModal: FC = memo(() => {
    const { deleteUser } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    const onDelete = async () => {
        console.log("start delete user");
        await deleteUser();
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
                        <Box textAlign={{ base: "left", md: "left" }} mb={5}>
                            <Text>
                                削除したアカウントの内容は復元できません
                            </Text>
                        </Box>

                        <Box w="80%" mx="auto" my={2}>
                            <Flex direction="column" gap={3}>
                                <Button
                                    backgroundColor="red.500"
                                    color="white"
                                    onClick={onDelete}
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
                        </Box>

                        {isLoading && (
                            <Box>
                                <Spinner />
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
});
