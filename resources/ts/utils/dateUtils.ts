const NEXT_EXAM_DATE = new Date("2025-10-12");
// const SECOND_NEXT_EXAM_DATE = '2025-10-##';

export const dateUtils = () => {
    const examYear = NEXT_EXAM_DATE.getFullYear();
    const examMonth = NEXT_EXAM_DATE.getMonth() + 1;
    const examDate = NEXT_EXAM_DATE.getDate();

    const daysUntilNextExam = () => {
        const today = new Date();
        const diff = NEXT_EXAM_DATE.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return { examYear, examMonth, examDate, daysUntilNextExam };
}