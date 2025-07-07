import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";

export const router  = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout></RootLayout>,
        children:[
            {
                 index:true,
                 
            }
           

        ]
    }
])