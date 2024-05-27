import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";

import { TopPage } from "./pages/TopPage";
import { Page404 } from "./pages/Page404";
import { ExamsPage } from "./pages/ExamsPage";
import { ExamsPageSample } from "./pages/ExamsPageSample";
import { Layout } from "./templates/Layout";

export const Router: FC = memo(() => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<TopPage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/sample" element={<ExamsPageSample />} />

                {/* 404 */}
                <Route path="/not-found" element={<Page404 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Layout>
    );
});
