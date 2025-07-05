import { createBrowserRouter } from "react-router-dom";
import ChooseDocument from "../pages/choose-document";
import ChooseSubDocument from "../pages/choose-sub-document";
import Layout from "../components/layout";
import { Documents } from "../pages/documents";

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
]);