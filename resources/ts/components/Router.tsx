import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";

import { TopPage } from "./pages/TopPage";
import { Page404 } from "./pages/Page404";
import { ExamsPage } from "./pages/ExamsPage";

export const Router: FC = memo(() => {
    return (
        <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/exams" element={<ExamsPage />} />

            {/* 404 */}
            <Route path="/not-found" element={<Page404 />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
});
