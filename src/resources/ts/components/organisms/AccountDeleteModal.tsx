import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
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
            <Box textAlign="right">
                <Button
                    onClick={onOpen}
                    borderRadius="full"
                    w="30%"
                    border="1px solid black"
                >
                    アカウントを削除
                </Button>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader m="auto">アカウントを削除</ModalHeader>
                    <ModalBody mb="20px">
                        <Center mb="20px">
                            <Icon as={GoAlert} color="red.500" boxSize="30%" />
                        </Center>
                        <Text>アカウントを削除しますか？</Text>
                        <Flex align="center" gap="5px">
                            <Icon
                                as={FaRegCheckCircle}
                                color="red.500"
                                boxSize={5}
                            />
                            <Text>
                                削除したアカウントの内容は復元できません
                            </Text>
                        </Flex>
                    </ModalBody>

                    <Box w="80%" mx="auto" my="10px">
                        <Flex direction="column" gap="10px">
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
                </ModalContent>
            </Modal>
        </Box>
    );
});
