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