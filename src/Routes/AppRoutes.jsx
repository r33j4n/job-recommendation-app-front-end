import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import LoginPageJobProvider from "../Pages/LoginPageJobProvider";
import SignupJobSeeker from "../Components/SignupJobSeeker";
import Logout from "../Components/LogoutComponent";
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/login/jobProvider", element: <LoginPageJobProvider /> },
  { path: "/login/jobSeeker", element: <LoginPage /> },
  { path: "/signup/jobSeeker", element: <SignupJobSeeker /> },
  { path:"/logout" ,element:<Logout/> } 


]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
