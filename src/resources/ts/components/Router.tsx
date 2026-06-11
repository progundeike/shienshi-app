import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { TopPage } from "./pages/TopPage";
import { Page404 } from "./pages/Page404";
import { ExamPage } from "./pages/ExamPage";
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
// import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { AdminRoutes } from "./templates/AdminRoutes";
import { EditExamPage } from "./pages/admin/EditExamPage";
import { NewsItemPage } from "./pages/admin/NewsItemPage";
import { InquiryPage } from "./pages/admin/InquiryPage";
import { EditExamListPage } from "./pages/admin/EditExamListPage";
import { useAtom } from "jotai";
import { userAtom } from "../states/userAtom";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { useChakraToast } from "../utils/toastUtils";
import { ExamInfoPage } from "./pages/ExamInfoPage";

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
                    <Route path="/admin/news-item" element={<NewsItemPage />} />
                    <Route path="/admin/inquiry" element={<InquiryPage />} />
                    <Route path="/admin/exams" element={<EditExamListPage />} />
                    <Route
                        path="/admin/edit/:year/:season/:section"
                        element={<EditExamPage />}
                    />
                </Route>

                {/* 404 */}
                <Route path="/not-found" element={<Page404 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Layout>
    );
};
