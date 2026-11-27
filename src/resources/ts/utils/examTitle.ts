// section はDB・URL上の通し番号。表示時だけ午後Ⅰ・Ⅱの問番号に変換する。
export const getExamTitleParts = (year: number, season: string, section: number) => {
    const seasonLabel = season === "haru" ? "春期" : season === "aki" ? "秋期" : "未登録";
    const isCombinedAfternoon = year > 2023 || (year === 2023 && season === "aki");
    let questionLabel = "未登録";

    if (Number.isInteger(section) && section > 0 && (season === "haru" || season === "aki")) {
        if (isCombinedAfternoon) {
            questionLabel = `午後 問${section}`;
        } else if (section <= 3) {
            questionLabel = `午後Ⅰ 問${section}`;
        } else if (section <= 5) {
            questionLabel = `午後Ⅱ 問${section - 3}`;
        }
    }

    // 2019年春期は改元前。既存の試験データに合わせて年度・季節から表記する。
    const japaneseYearLabel = year > 2019 || (year === 2019 && season === "aki")
        ? `令和${year - 2018}年`
        : `平成${year - 1988}年`;

    return {
        yearLabel: `${year}年`,
        japaneseYearLabel,
        sessionLabel: `${seasonLabel} ${questionLabel}`,
    };
};

export const formatExamTitle = (year: number, season: string, section: number): string => {
    const { yearLabel, sessionLabel } = getExamTitleParts(year, season, section);
    return `${yearLabel} ${sessionLabel}`;
};
