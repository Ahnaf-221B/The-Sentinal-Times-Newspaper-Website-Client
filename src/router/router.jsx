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

export const router  = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout></RootLayout>,
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
            element: <Payment></Payment>
           },
           {
            path:'/add-article',
            element: <AddArticle></AddArticle>
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
            element: <PremiumArticle></PremiumArticle>
           },
           {
            path:'/my-article',
            element: <MyArticle></MyArticle>
           },
           {
            path:'/subscription',
           element: <PaymentForm></PaymentForm>
           },
           {
            path: '/make-payment',
            element: <Payment></Payment>
           }
        ]
    },
    {
        path:'/dashboard',
        element : <DashboardLayout></DashboardLayout>,
        children:[
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