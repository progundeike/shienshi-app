import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";

import { TopPage } from "./pages/TopPage";
import { Page404 } from "./pages/Page404";
import { ExamPage } from "./pages/ExamPage";
import { ExamsPageSample } from "./pages/ExamsPageSample";
import { Layout } from "./templates/Layout";
import { AboutPage } from "./pages/AboutPage";
import { ExamsListPage } from "./pages/ExamsListPage";

export const Router: FC = memo(() => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<TopPage />} />
                <Route path="/exams" element={<ExamPage />} />
                <Route path="/exams_list" element={<ExamsListPage />} />
                <Route path="/sample" element={<ExamsPageSample />} />

                <Route path="/about" element={<AboutPage />} />
                {/* 404 */}
                <Route path="/not-found" element={<Page404 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Layout>
    );
});
