import { Outlet, Navigate } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { LoadingPage } from "../pages/LoadingPage";
import { useAtomValue } from "jotai";

export const PreAuthRoutes = () => {
    const user = useAtomValue(userAtom);
    const isLoading = useAtomValue(loadingAtom);

    if (isLoading) {
        return <LoadingPage />;
    }

    return user ? <Navigate to="/my-page" /> : <Outlet />;
};
