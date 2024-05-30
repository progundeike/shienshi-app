import { FC, memo } from "react";
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

export const Router: FC = memo(() => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<TopPage />} />

                <Route path="/exams" element={<ExamPage />} />
                <Route path="/exams_list" element={<ExamsListPage />} />
                <Route path="/sample" element={<ExamsPageSample />} />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* ログイン後 */}
                {/* <Route element={<PrivateRoutes />}>
                    <Route path="/my-page" element={<MyPage />} />
                    <Route path="/update-email" element={<UpdateEmailPage />} />
                    <Route
                        path="/register-email"
                        element={<RegisterEmailPage />}
                    />
                    <Route
                        path="/review/create"
                        element={<CreateReviewPage />}
                    />
                    <Route
                        path="/delete-account"
                        element={<DeleteAccountPage />}
                    />
                </Route> */}

                {/* 認証 */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                /> */}
                {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

                {/* 404 */}
                <Route path="/not-found" element={<Page404 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Layout>
    );
});
