import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.jsx'
import AuthProvider from './Context/AuthProvider.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<ToastContainer></ToastContainer>
			<RouterProvider router={router}></RouterProvider>
		</AuthProvider>
	</StrictMode>
);
