export type RegisterFormInput = {
    username: string;
    email: string;
    password: string;
};

export type LoginFormInput = {
    username: string;
    password: string;
};

export type PasswordResetFormInput = {
    token: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

export type InquiryInput = {
    name: string;
    email: string | null;
    message: string;
};

export type ErrorResponse = {
    message: string;
    errors: {
        [key: string]: string[];
    };
};

export type Dialogue = {
    role: "user" | "assistant";
    content: string;
};

export type QuestionFormInputs = {
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number | null;
    text: string;
    type: "radio" | "checkbox" | "input" | "textarea";
    options?: {
        label: string;
        value: string;
    }[];
    maxLength?: number | null;
};

export type ModelAnswer = {
    questionCode: string;
    text: string;
};

// type QuestionFormInputs = {
//     question_number: number;
//     sub_question_number: number;
//     small_question_number?: number;
//     text: string;
//     type: "radio" | "checkbox" | "input" | "textarea";
//     options?: {
//         label: string;
//         value: string;
//     }[];
//     max_length?: number;
// };