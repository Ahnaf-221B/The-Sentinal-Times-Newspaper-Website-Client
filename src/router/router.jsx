import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../Home/Home/Home";
import Login from "../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";

import Payment from "../pages/Payment/Payment";
import DashboardLayout from "../layout/DashboardLayout";
import AddPublisher from "../pages/Dashboard/AddPublisher/AddPublisher";
import AllArticle from "../pages/Dashboard/AllArticle/AllArticle";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import AddArticle from "../pages/AddArticle/AddArticle";
import UserAllArticle from "../pages/UserAllArticle/UserAllArticle";
import ArticleDetails from "../pages/ArticleDetails/ArticleDetails";
import PremiumArticle from "../pages/PremiumArticle/PremiumArticle";
import MyArticle from "../pages/MyArticle/MyArticle";
import PaymentForm from "../pages/Payment/PaymentForm";
import MakePayment from "../pages/Payment/MakePayment";
import AdminRoute from "../routes/AdminRoute";
import MyProfile from "../pages/MyProfile/MyProfile";
import DashboardHome from "../pages/Dashboard/DashboardHome.jsx/DashboardHome";
import PrivateRoute from "../routes/PrivateRoute";
import Forbidden from "../pages/Forbidden/Forbidden";

export const router  = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout></RootLayout>,
        errorElement: <Forbidden></Forbidden>,
        children:[
            {
                 index:true,
                 element: <Home></Home>
               
            },
            {
                path: '/login',
                element: <Login></Login>
            },
           {
            path: '/register',
            element: <Register></Register>
           },
           {
            path:'/payment',
            element: <PrivateRoute><Payment></Payment></PrivateRoute>
           },
           {
            path:'/add-article',
            element: <PrivateRoute><AddArticle></AddArticle></PrivateRoute>
           },
           {
            path:'/all-articles',
            element: <UserAllArticle></UserAllArticle>
           },
           {
            path: '/article-details/:id',
            element : <ArticleDetails></ArticleDetails>
           },
           {
            path:'/premium-article',
            element: <PrivateRoute><PremiumArticle></PremiumArticle></PrivateRoute>
           },
           {
            path:'/my-article',
            element: <PrivateRoute><MyArticle></MyArticle></PrivateRoute>
           },
           {
            path:'/subscription',
           element: <PrivateRoute><PaymentForm></PaymentForm></PrivateRoute>
           },
           {
            path: '/make-payment',
            element: <Payment></Payment>
           },
           {
            path:'/my-profile',
            element: <PrivateRoute><MyProfile></MyProfile></PrivateRoute>
           }
        ]
    },
    {
        path:'/dashboard',
        element :<AdminRoute><DashboardLayout></DashboardLayout></AdminRoute> ,
        children:[
            {
                index:true,
                element: <DashboardHome></DashboardHome>
            },
           {
            path:'add-publisher',
            element: <AddPublisher></AddPublisher>
           },
           {
            path: 'all-articles',
            element: <AllArticle></AllArticle>
           },
           {
            path:'all-users',
            element: <AllUsers></AllUsers>
           }
        ]
    }
])