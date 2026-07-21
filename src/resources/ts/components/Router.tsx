import { useEffect, lazy, Suspense, useRef } from "react";
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
import { userAtom } from "../states/userAtom";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { useChakraToast } from "../utils/toastUtils";
import { LoadingPage } from "./pages/LoadingPage";
import { AdminRoutes } from "./templates/AdminRoutes";
import { AdminTwoFactorSetupPage } from "./pages/admin/AdminTwoFactorSetupPage";
import { TwoFactorChallengePage } from "./pages/admin/TwoFactorChallengePage";
// import { ExamInfoPage } from "./pages/ExamInfoPage";

// lazy import
const ExamPage = lazy(() =>
    import("./pages/ExamPage").then((module) => ({
        default: module.ExamPage,
    })),
);
const AdminRouteGroup = lazy(() =>
    import("./AdminRouteGroup").then((module) => ({
        default: module.AdminRouteGroup,
    })),
);

export const Router = () => {
    const { getUser } = useAuth();
    const [user, setUser] = useAtom(userAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const { showWarningToast } = useChakraToast();
    const isHandlingAuthExpired = useRef(false);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        const onExpired = () => {
            // 同時に２回呼ばれても処理は1回だけでよい
            if (isHandlingAuthExpired.current) {
                return;
            }

            const authPaths = ["/login", "/register", "/two-factor-challenge"];
            if (authPaths.includes(location.pathname)) {
                return;
            }

            isHandlingAuthExpired.current = true;

            setUser(null);

            showWarningToast(
                "認証の有効期限が切れました。再度ログインしてください。",
            );

            console.log("セッション切れ時のlocation", {
                pathname: location.pathname,
                search: location.search,
                hash: location.hash,
            });

            navigate("/login", {
                replace: true,
                state: { from: location.pathname },
            });
        };

        window.addEventListener(
            "auth:Unauthenticated",
            onExpired as EventListener,
        );

        window.addEventListener("auth:Expired", onExpired as EventListener);

        return () => {
            window.removeEventListener(
                "auth:Unauthenticated",
                onExpired as EventListener,
            );
            window.removeEventListener(
                "auth:Expired",
                onExpired as EventListener,
            );
        };
    }, [navigate, location.pathname, showWarningToast, setUser]);

    // ログイン後にフラグを戻す
    useEffect(() => {
        if (user) {
            isHandlingAuthExpired.current = false;
        }
    }, [user]);

    return (
        <Layout>
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route path="/" element={<TopPage />} />
                    {/* <Route path="/info" element={<ExamInfoPage />} /> */}

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
                        <Route
                            path="/two-factor-challenge"
                            element={<TwoFactorChallengePage />}
                        />
                    </Route>

                    {/* ログイン後 */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/my-page" element={<MyPage />} />
                        <Route
                            path="/update-password"
                            element={<UpdatePasswordPage />}
                        />
                        <Route
                            path="/admin/two-factor-setup"
                            element={<AdminTwoFactorSetupPage />}
                        />
                    </Route>

                    {/* 管理者ページ */}
                    <Route element={<AdminRoutes />}>
                        <Route path="/admin/*" element={<AdminRouteGroup />} />
                    </Route>

                    {/* 404 */}
                    <Route path="/not-found" element={<Page404 />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Suspense>
        </Layout>
    );
};
