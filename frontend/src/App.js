
import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import 'assets/plugins/nucleo/css/nucleo.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'assets/scss/argon-dashboard-react.scss'
import AdminLayout from 'layouts/Admin.js'
import AuthLayout from 'layouts/Auth.js'
import { UserContextProvider } from 'context/UserContext'
import ProtectedRoute from './utils/ProtectedRoute'
import { WebSocketProvider } from 'context/WebsocketContext'

const App = () => {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <WebSocketProvider>
                    <Routes>
                        <Route path="/auth/*" element={<AuthLayout />} />
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>}
                        />
                        <Route
                            path="/"
                            element={<Navigate to="/auth/login" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </WebSocketProvider>
            </UserContextProvider>
        </BrowserRouter>
    )
}

export default App