import { useQuery } from "@tanstack/react-query";
import { useExam } from "./useExam";

// 通常画面と別画面で、URLの検証・キャッシュ・再確認条件を共通化する。
export const useExamPdfExists = (year = "", season = "", section = "") => {
    const isValid = /^\d{4}$/.test(year) && /^(haru|aki)$/.test(season) && /^[1-5]$/.test(section);
    const { checkPdfExists } = useExam();
    const query = useQuery({
        queryKey: ["examPdfExists", year, season, section],
        queryFn: () => checkPdfExists(Number(year), season, Number(section)),
        enabled: isValid,
        retry: false,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return { ...query, isValid };
};
