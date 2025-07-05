import { createBrowserRouter } from "react-router-dom";
import ChooseDocument from "../pages/choose-document";
import Layout from "../components/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ChooseDocument />,
      },
    ],
  },
]);