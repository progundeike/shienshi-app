export type RegisterFormInput = {
    username: string;
    nickname: string;
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
