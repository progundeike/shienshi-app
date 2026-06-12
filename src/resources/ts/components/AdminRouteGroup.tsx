import { Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/admin/AdminPage";
import { EditExamListPage } from "./pages/admin/EditExamListPage";
import { EditExamPage } from "./pages/admin/EditExamPage";
import { InquiryPage } from "./pages/admin/InquiryPage";
import { NewsItemPage } from "./pages/admin/NewsItemPage";

export const AdminRouteGroup = () => {
    return (
        <Routes>
            <Route index element={<AdminPage />} />
            <Route path="news-item" element={<NewsItemPage />} />
            <Route path="inquiry" element={<InquiryPage />} />
            <Route path="exams" element={<EditExamListPage />} />
            <Route
                path="/admin/edit/:year/:season/:section"
                element={<EditExamPage />}
            />
        </Routes>
    );
};
