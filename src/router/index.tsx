import { createBrowserRouter } from "react-router-dom";
import ChooseDocument from "../pages/choose-document";
import ChooseSubDocument from "../pages/choose-sub-document";
import Layout from "../components/layout";
import { Documents } from "../pages/documents";
import { DocumentEditor } from "../pages/document-editor";
import { ThemChuTheProvider } from "@/context/them-chu-the";
import LoginPage from "@/pages/login";
import SubmitContract from "@/pages/submit-contract";
import History from "@/pages/history";
import NotFound from "@/pages/not-found";
import ProfilePage from "@/pages/profile";
import { ErrorBoundary } from "@/components/common/error-boundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <ChooseDocument />,
      },
      {
        path: "/van-ban/:category",
        element: <ChooseSubDocument />,
      },
      {
        path: "/van-ban/:category/:subCategory",
        element: <Documents />,
      },
      {
        path: "/editor",
        element: (
          <ThemChuTheProvider>
            <DocumentEditor />
          </ThemChuTheProvider>
        ),
      },
      {
        path: "/submit-contract",
        element: <SubmitContract />,
      },
      {
        path: "/edit-contract",
        element: <SubmitContract isEdit={true} />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
