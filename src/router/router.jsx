import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../Home/Home/Home";
import Login from "../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";

import Payment from "../pages/Payment/Payment";
import DashboardLayout from "../layout/DashboardLayout";

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
           }

        ]
    },
    {
        path:'/dashboard',
        element : <DashboardLayout></DashboardLayout>,
        children:[
           {
            
           }
        ]
    }
])