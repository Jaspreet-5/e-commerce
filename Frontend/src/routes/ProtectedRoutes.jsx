import useAuth from '../Auth/useAuth'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

    const {user , loading} = useAuth();

    if(loading){
        return <p>Checking Authentication...</p>
    }

    if(!user){
        return <Navigate to={'/login'} replace/>
    }

    return <Outlet />

}

export default ProtectedRoutes
