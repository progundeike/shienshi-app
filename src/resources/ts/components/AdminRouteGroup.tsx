import { Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/admin/AdminPage";
import { EditExamListPage } from "./pages/admin/EditExamListPage";
import { EditExamPage } from "./pages/admin/EditExamPage";
import { InquiryPage } from "./pages/admin/InquiryPage";
import { NewsItemPage } from "./pages/admin/NewsItemPage";
import { Page404 } from "./pages/Page404";

export const AdminRouteGroup = () => {
    return (
        <Routes>
            <Route index element={<AdminPage />} />
            <Route path="news-item" element={<NewsItemPage />} />
            <Route path="inquiry" element={<InquiryPage />} />
            <Route path="exams" element={<EditExamListPage />} />
            <Route
                path="edit/:year/:season/:section"
                element={<EditExamPage />}
            />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
};
