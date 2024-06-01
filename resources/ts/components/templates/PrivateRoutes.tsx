import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { LoadingPage } from "../pages/LoadingPage";

export const PrivateRoutes = () => {
    const user = useRecoilValue(userAtom);
    const location = useLocation();
    const isLoading = useRecoilValue(loadingAtom);

    if (isLoading) {
        return <LoadingPage />;
    }

    return user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={location.pathname} />
    );
};
