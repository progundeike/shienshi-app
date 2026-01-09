import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewsItem } from "../types/form";
import { useChakraToast } from "../utils/toastUtils";
import { axiosInstance } from "./axiosInstance";
import { get } from "react-hook-form";

export const useNewsItem = () => {
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    const qc = useQueryClient();

    // 一覧取得
    const newsItemList = useQuery({
        queryKey: ["newsItems"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/news`);
            return response.data;
        }
    });
    
    const updateNewsItem = useMutation({
            mutationFn: async (data: NewsItem) => {
                await axiosInstance.post(
                    `/api/admin/news`,
                    data
                );
            },
            onSuccess: () => {
                qc.invalidateQueries({ queryKey: ["newsItems"] });
                toast({
                    title: "お知らせを保存しました",
                    status: "success",
                    duration: 6000,
                    isClosable: true,
                });
            },
            onError: (err: any) => {
                if (err?.response?.status === 422) throw err;
                toast(unexpectedServerErrorToast);
            } 
        });

    const deleteNewsItem = useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`/api/admin/news/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["newsItems"] });
            toast({
                title: "お知らせを削除しました",
                status: "success",
                duration: 6000,
                isClosable: true,
            });
        },
        onError: () => toast(unexpectedServerErrorToast),
    });


    return {
        newsItemList, updateNewsItem, deleteNewsItem
    };
}