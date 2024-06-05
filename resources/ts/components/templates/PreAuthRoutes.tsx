import { Outlet, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { LoadingPage } from "../pages/LoadingPage";

export const PreAuthRoutes = () => {
    const user = useRecoilValue(userAtom);
    const isLoading = useRecoilValue(loadingAtom);

    if (isLoading) {
        return <LoadingPage />;
    }

    return user ? <Navigate to="/my-page" /> : <Outlet />;
};
