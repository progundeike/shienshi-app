import { Box, Flex, Button, useToast, Input, Icon } from "@chakra-ui/react";
import { ChangeEvent, FC, memo, useRef, useState } from "react";
import { set } from "react-hook-form";
import { FaRegFilePdf } from "react-icons/fa6";

import { useAdmin } from "../../hooks/useAdmin";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const PdfUploadForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const toast = useToast();
    const { uploadPdf, deletePdf } = useAdmin();
    const inputRef = useRef<HTMLInputElement>(null);

    const onFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        try {
            uploadPdf(year, season, section, e.target.files[0]);
        } finally {
            // ファイルアップロード後にinputをリセット
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <Flex gap="50px" justifyContent="center" my="10px">
            <Box position="relative">
                <Input
                    onChange={onFileInputChange}
                    type="file"
                    accept=".pdf"
                    w="100%"
                    h="100%"
                    position="absolute"
                    hidden
                    tabIndex={-1}
                    ref={inputRef}
                />
                <Button
                    borderRadius="full"
                    colorScheme="blue"
                    onClick={() => {
                        inputRef.current?.click();
                    }}
                >
                    <Icon as={FaRegFilePdf} name="upload" mr="10px" />
                    問題ファイルを登録
                </Button>
            </Box>

            <Box>
                <Button
                    colorScheme="red"
                    borderRadius="full"
                    onClick={() => deletePdf(year, season, section)}
                >
                    ファイルを削除
                </Button>
            </Box>
        </Flex>
    );
});
