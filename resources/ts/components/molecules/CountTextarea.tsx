import { Textarea, Box } from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { UseFormRegisterReturn, UseFormWatch, useForm } from "react-hook-form";
// import { Answer } from "../organisms/QuestionAndAnswerForm";

// type Props = {
//     maxLength: number;
//     questionId: number;
//     subQuestionId: number;
//     register: UseFormRegisterReturn;
//     watch: UseFormWatch<Answer>;
// };

// type Input = {
//     answer: string;
// };

// export const CountTextarea: FC<Props> = memo((Props) => {
//     const { maxLength, questionId, watch, register } = Props;
//     // const [answerLength, setAnswerLength] = useState(0);

//     const watchAnswer = watch("answer", "");

//     return (
//         <>
//             <Textarea {...register} />
//             {maxLength && (
//                 <Box textAlign="right">
//                     ({watchAnswer.length || 0}/{maxLength})
//                 </Box>
//             )}
//         </>
//     );
// });
