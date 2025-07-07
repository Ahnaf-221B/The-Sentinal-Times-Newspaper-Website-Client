import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../Home/Home/Home";

export const router  = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout></RootLayout>,
        children:[
            {
                 index:true,
                 element: <Home></Home>
            }
           

        ]
    }
])