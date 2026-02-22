import { Outlet, Navigate, useLocation } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { LoadingPage } from "../pages/LoadingPage";
import { useAtomValue } from "jotai";
import { Page404 } from "../pages/Page404";

export const AdminRoutes = () => {
    const user = useAtomValue(userAtom);
    const location = useLocation();
    const isLoading = useAtomValue(loadingAtom);

    // user取得前はLoadingPageを表示
    if (isLoading || user === undefined) {
        return <LoadingPage />;
    }

    if (user === null) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (user.isAdmin) {
        return <Outlet />;
    } else {
        return <Page404 />;
    }
};
