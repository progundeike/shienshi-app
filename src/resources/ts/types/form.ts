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

export type Inquiry = {
    id: number;
    user_id: number | null;
    name: string;
    email: string | null;
    message: string;
    created_at: string;
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

export type AnswerItem = {
    questionCode: string;
    content: string | string[];
};

export type QuestionFormInputs = {
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number | null;
    text: string;
    textForAi: string | null;
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

export type NewsItem = {
    id?: number;
    title: string;
    content: string | null;
    published_at: string;
};