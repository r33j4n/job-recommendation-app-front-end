import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import LoginPageJobProvider from "../Pages/LoginPageJobProvider";
import SignupJobSeeker from "../Components/SignupJobSeeker";
import Logout from "../Components/LogoutComponent";
import JobSeekerDashboardPage from "../Pages/JobSeekerDashBoardPage";
import JobProviderDashBoardPage from "../Pages/JobProviderDashBoardPage";
import JobSeekerAllJobs from "../Pages/JobSeekerAllJobs";
import JobSeekerAppliedJobs from "../Pages/JobSeekerAppliedJobs";
import JobSeekerFindJobs from "../Pages/JobSeekerFindJobs";
import JobSeekerProfileDetails from "../Pages/JobSeekerProfileDetails";
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/login/jobProvider", element: <LoginPageJobProvider /> },
  { path: "/login/jobSeeker", element: <LoginPage /> },
  { path: "/signup/jobSeeker", element: <SignupJobSeeker /> },
  { path:"/logout" ,element:<Logout/> } ,
  { path:"/dashboard/jobseeker" ,element:<JobSeekerDashboardPage/> }, 
  { path:"/alljobs/jobseeker" ,element:<JobSeekerAllJobs/> }, 
  { path:"/appliedjobs/jobseeker" ,element:<JobSeekerAppliedJobs/> }, 
  { path:"/findjobs/jobseeker" ,element:<JobSeekerFindJobs/> },
  { path:"/profiledetails/jobseeker" ,element:<JobSeekerProfileDetails/> },

  { path:"/dashboard/jobprovider" ,element:<JobProviderDashBoardPage/> } ,


]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
