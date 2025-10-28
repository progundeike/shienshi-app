import { FC, memo, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { TopPage } from "./pages/TopPage";
import { Page404 } from "./pages/Page404";
import { ExamPage } from "./pages/ExamPage";
import { ExamsPageSample } from "./pages/ExamsPageSample";
import { Layout } from "./templates/Layout";
import { AboutPage } from "./pages/AboutPage";
import { ExamsListPage } from "./pages/ExamsListPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivateRoutes } from "./templates/PrivateRoutes";
import { MyPage } from "./pages/MyPage";
import { useAuth } from "../hooks/useAuth";
import { PreAuthRoutes } from "./templates/PreAuthRoutes";
import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { RegisterEmailPage } from "./pages/auth/RegisterEmailPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminRoutes } from "./templates/AdminRoutes";
import { EditExamPage } from "./pages/EditExamPage";

export const Router: FC = memo(() => {
    const { getUser } = useAuth();

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<TopPage />} />

                <Route
                    path="/exams/:year/:season/:section"
                    element={<ExamPage />}
                />
                <Route path="/exams_list" element={<ExamsListPage />} />
                <Route path="/sample" element={<ExamsPageSample />} />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* ログイン前 */}
                <Route element={<PreAuthRoutes />}>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                </Route>

                {/* ログイン後 */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/my-page" element={<MyPage />} />
                    {/* <Route path="/update-email" element={<UpdateEmailPage />} /> */}
                    <Route
                        path="/register-email"
                        element={<RegisterEmailPage />}
                    />
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
});
