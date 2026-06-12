import { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import { TopPage } from "./pages/TopPage";
import { Page404 } from "./pages/Page404";
import { Layout } from "./templates/Layout";
import { ExamsListPage } from "./pages/ExamsListPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivateRoutes } from "./templates/PrivateRoutes";
import { MyPage } from "./pages/MyPage";
import { useAuth } from "../hooks/useAuth";
import { PreAuthRoutes } from "./templates/PreAuthRoutes";
import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { AdminRoutes } from "./templates/AdminRoutes";

import { userAtom } from "../states/userAtom";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { useChakraToast } from "../utils/toastUtils";
import { ExamInfoPage } from "./pages/ExamInfoPage";
import { LoadingPage } from "./pages/LoadingPage";

// lazy import
const ExamPage = lazy(() =>
    import("./pages/ExamPage").then((module) => ({
        default: module.ExamPage,
    })),
);
const AdminPage = lazy(() =>
    import("./pages/admin/AdminPage").then((module) => ({
        default: module.AdminPage,
    })),
);
const EditExamPage = lazy(() =>
    import("./pages/admin/EditExamPage").then((module) => ({
        default: module.EditExamPage,
    })),
);
const NewsItemPage = lazy(() =>
    import("./pages/admin/NewsItemPage").then((module) => ({
        default: module.NewsItemPage,
    })),
);
const InquiryPage = lazy(() =>
    import("./pages/admin/InquiryPage").then((module) => ({
        default: module.InquiryPage,
    })),
);
const EditExamListPage = lazy(() =>
    import("./pages/admin/EditExamListPage").then((module) => ({
        default: module.EditExamListPage,
    })),
);

export const Router = () => {
    const { getUser } = useAuth();
    const [, setUser] = useAtom(userAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const { showWarningToast } = useChakraToast();

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        const onExpired = () => {
            setUser(null);

            showWarningToast(
                "認証の有効期限が切れました。再度ログインしてください。",
            );

            navigate("/login", {
                replace: true,
                state: { from: location.pathname },
            });
        };

        window.addEventListener(
            "auth:Unauthenticated",
            onExpired as EventListener,
        );

        return () => {
            window.removeEventListener(
                "auth:Unauthenticated",
                onExpired as EventListener,
            );
        };
    }, [navigate, location.pathname, showWarningToast, setUser]);

    return (
        <Layout>
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route path="/" element={<TopPage />} />
                    <Route path="/info" element={<ExamInfoPage />} />

                    <Route
                        path="/exams/:year/:season/:section"
                        element={<ExamPage />}
                    />
                    <Route path="/exams" element={<ExamsListPage />} />

                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />

                    {/* ログイン前 */}
                    <Route element={<PreAuthRoutes />}>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Route>

                    {/* ログイン後 */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/my-page" element={<MyPage />} />
                        {/* <Route
                        path="/delete-account"
                        element={<DeleteAccountPage />}
                    /> */}
                        <Route
                            path="/update-password"
                            element={<UpdatePasswordPage />}
                        />
                    </Route>

                    {/* 管理者ページ */}
                    <Route element={<AdminRoutes />}>
                        <Route path="/admin" element={<AdminPage />} />
                        <Route
                            path="/admin/news-item"
                            element={<NewsItemPage />}
                        />
                        <Route
                            path="/admin/inquiry"
                            element={<InquiryPage />}
                        />
                        <Route
                            path="/admin/exams"
                            element={<EditExamListPage />}
                        />
                        <Route
                            path="/admin/edit/:year/:season/:section"
                            element={<EditExamPage />}
                        />
                    </Route>

                    {/* 404 */}
                    <Route path="/not-found" element={<Page404 />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Suspense>
        </Layout>
    );
};
