import { Outlet, Navigate, useLocation } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { LoadingPage } from "../pages/LoadingPage";
import { useAtomValue } from "jotai";

export const PrivateRoutes = () => {
    const user = useAtomValue(userAtom);
    const location = useLocation();
    const isLoading = useAtomValue(loadingAtom);

    if (isLoading) {
        return <LoadingPage />;
    }

    return user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
};
