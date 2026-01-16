import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ roles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Manual JWT decode to avoid adding 'jwt-decode' dependency
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);

        // Check expiration
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            localStorage.removeItem('token');
            toast.error("Session expirée, veuillez vous reconnecter.");
            return <Navigate to="/login" replace />;
        }

        if (roles && roles.length > 0 && !roles.includes(payload.role)) {
            // Role not authorized
            return <Navigate to="/" replace />;
        }

        return <Outlet />;

    } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
