import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../Auth/useAuth";

const AdminProtectedRoutes = () => {

    const { user , loading} = useAuth();

    if(loading){
        return <p>Checking Authenticating...</p>
    }

    if(!user){
        <Navigate to={'/login'} replace/>
        return;
    }

    if(user.role !== "admin"){
        // console.log(user)
        return <p>You are not Authorized!</p>
    }
    

    return <Outlet />
}

export default AdminProtectedRoutes



