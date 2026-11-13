import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";

type PublicSiteAnnouncement = {
    top_visible: boolean;
    header_visible: boolean;
    message: string | null;
};

export const siteAnnouncementQueryKey = ["siteAnnouncement", "public"] as const;

export const useSiteAnnouncement = () => {
    return useQuery({
        queryKey: siteAnnouncementQueryKey,
        queryFn: async ({ signal }): Promise<PublicSiteAnnouncement> => {
            const response = await axiosInstance.get<PublicSiteAnnouncement>(
                "/api/site-announcement",
                { signal },
            );

            return response.data;
        },
        refetchInterval: 60_000,
        refetchIntervalInBackground: false,
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
        retry: 1,
    });
};
