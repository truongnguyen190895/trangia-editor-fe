import { createBrowserRouter } from "react-router-dom";
import ChooseDocument from "../pages/choose-document";
import ChooseSubDocument from "../pages/choose-sub-document";
import Layout from "../components/layout";
import { Documents } from "../pages/documents";
import { DocumentEditor } from "../pages/document-editor";
import { ThemChuTheProvider } from "@/context/them-chu-the";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
    ],
  },
  {
    path: "/editor",
    element: (
      <ThemChuTheProvider>
        <DocumentEditor />
      </ThemChuTheProvider>
    ),
  },
]);
