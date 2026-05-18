export type FetchedQuestion = {
    examCode: string;
    questionCode: string;
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number;
    type: "radio" | "checkbox" | "input" | "textarea";
    text: string;
    options: Option[] | null; // JSON文字列
    maxLength: number | null;
};

export type QuestionForEdit = {
    examCode: string;
    questionCode: string;
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number;
    type: "radio" | "checkbox" | "input" | "textarea";
    text: string;
    textForAi: string | null;
    options: Option[] | null; // JSON文字列
    maxLength: number | null;
};

export type Option = {
    label: string;
    value: string;
};

export type SubmittedExam = {
    year: number;
    season: string;
    section: number;
    season_japanese: string;
    section_converted: string;
};

export type UpdateQuestionInputs = {
    examCode: string;
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number | null;
    type: "radio" | "checkbox" | "input" | "textarea";
    text: string;
    textForAi: string | null;
    options: Option[] | null; // JSON文字列
    maxLength: number | null;
};

export type PurposeAndReviewComment = {
    purpose: string | null;
    reviewComment: string | null;
};
