import { createBrowserRouter } from "react-router-dom";
import QuestionAndAnswer from "./Pages/QuestionAndAnswer/QuestionAndAnswer.jsx";
import AskQuestion from "./Pages/AskQuestion/AskQuestion.jsx";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.jsx";
import Home from "./Pages/Home/Home.jsx";
import Auth from "./Pages/Auth/Auth.jsx";
import ProtectRoute from "./components/ProtectRoute/ProtectRoute.jsx";
import Layout from "./Layout/Layout.jsx";
import ForgotPassword from "./Pages/ResetPassword/ForgotPassword.jsx";
import ComingSoon from "./Pages/ComingSoon/ComingSoon.jsx";
import Terms from "./Pages/Terms/Terms.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy.jsx";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectRoute redirect={"/"}>
            <Home />
          </ProtectRoute>
        ),
      },
      {
        path: "/ask",
        element: (
          <ProtectRoute redirect={"/ask"}>
            <AskQuestion />
          </ProtectRoute>
        ),
      },
      {
        path: "/question/:questionId",
        element: (
          <ProtectRoute redirect={"/question/:questionId"}>
            <QuestionAndAnswer />
          </ProtectRoute>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/forgetPassword",
        element: <ForgotPassword />,
      },
      {
        path: "/howitworks",
        element: <ComingSoon />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/PrivacyPolicy",
        element: <PrivacyPolicy />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
