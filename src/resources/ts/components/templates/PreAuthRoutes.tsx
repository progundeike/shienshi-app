import { Outlet, Navigate, useLocation } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { LoadingPage } from "../pages/LoadingPage";
import { useAtomValue } from "jotai";

type LoginLocationState = {
    from?: string;
};

export const PreAuthRoutes = () => {
    const user = useAtomValue(userAtom);
    const isLoading = useAtomValue(loadingAtom);
    const location = useLocation();

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!user) {
        return <Outlet />;
    }

    const state = location.state as LoginLocationState | null;
    const from = state?.from ?? "/my-page";

    // ログインページ自身に戻すとループする
    const redirectTo = from === "/login" ? "/my-page" : from;

    return <Navigate to={redirectTo} replace />;
};
