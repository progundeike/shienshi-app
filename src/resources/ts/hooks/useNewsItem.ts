import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewsItem } from "../types/form";
import { useChakraToast } from "../utils/toastUtils";
import { axiosInstance } from "./axiosInstance";
import { get } from "react-hook-form";

export const useNewsItem = () => {
    const { showServerErrorToast, showSuccessToast } = useChakraToast();

    const qc = useQueryClient();

    // 一覧取得
    const newsItemList = useQuery({
        queryKey: ["newsItems"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/news`);
            return response.data;
        },
    });

    const updateNewsItem = useMutation({
        mutationFn: async (data: NewsItem) => {
            await axiosInstance.post(`/api/admin/news`, data);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["newsItems"] });
            showSuccessToast("お知らせを保存しました");
        },
        onError: (err: any) => {
            if (err?.response?.status === 422) throw err;
            showServerErrorToast("お知らせの保存に失敗しました");
        },
    });

    const deleteNewsItem = useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`/api/admin/news/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["newsItems"] });
            showSuccessToast("お知らせを削除しました");
        },
        onError: () => {
            showServerErrorToast("お知らせの削除に失敗しました");
        },
    });

    return {
        newsItemList,
        updateNewsItem,
        deleteNewsItem,
    };
};
