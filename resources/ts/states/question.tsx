export type Question = {
    type: "radio" | "textarea";
    text: string;
    options?: { label: string; value: string }[]; // ラジオボタンの選択肢
    maxLength: number; // テキストエリアの最大文字数。指定がない場合は0
};

export type QuestionList = {
    id: number;
    questions: Question[];
};

export const questionData: QuestionList[] = [
    {
        id: 1,
        questions: [
            {
                type: "radio",
                text: "(1) XSS脆弱性の種類を解答群の中から選び, 記号で答えよ。",
                options: [
                    { label: "ア DOM Based XSS", value: "a" },
                    { label: "イ 格納型 XSS", value: "b" },
                    { label: "ウ 反射型 XSS", value: "c" },
                ],
                maxLength: 0,
            },
            {
                type: "textarea",
                text: "(2) WebアプリQにおける対策を, 30字以内で答えよ。",
                maxLength: 30,
            },
        ],
    },
    {
        id: 2,
        questions: [
            {
                type: "textarea",
                text: "図3について, 入力文字数制限を超える長さのスクリプトが実行されるようにした方法を, 50字以内で答えよ。",
                maxLength: 50,
            },
        ],
    },
];
