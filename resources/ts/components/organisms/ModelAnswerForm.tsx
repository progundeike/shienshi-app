// import { Box, Text, Textarea } from "@chakra-ui/react";
// import { memo, FC, useEffect, useState } from "react";
// import { AnswerInputs, ModelAnswer } from "../../types/form";
// import { FetchedQuestion } from "../../hooks/useExam";
// import {
//     Control,
//     useController,
//     UseFormRegister,
//     UseFormWatch,
// } from "react-hook-form";

// type Props = {
//     questionCode: string;
//     modelAnswer: ModelAnswer | undefined;
//     control: Control<AnswerInputs>;
// };

// export const ModelAnswerForm: FC<Props> = (props) => {
//     const { modelAnswer, questionCode, control } = props;

//     const fieldName: `answer.${string}` = `answer.${questionCode}`;

//     const { field } = useController({
//         name: fieldName,
//         control,
//         defaultValue: "",
//     });

//     useEffect(() => {
//         if (modelAnswer) {
//             field.onChange(modelAnswer.text);
//         }
//     }, [modelAnswer]);

//     return (
//         <Box
//             p="10px"
//             borderWidth="1px"
//             borderRadius="md"
//             bg="gray.50"
//             mb="30px"
//         >
//             <Text fontWeight="bold">模範解答:</Text>
//             <Textarea whiteSpace={"pre-line"} {...field} readOnly />
//         </Box>
//     );
// };
