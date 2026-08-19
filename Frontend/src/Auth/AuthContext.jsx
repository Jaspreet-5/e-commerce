import { createContext, useEffect, useState } from 'react'
import {
    login as userLogin,
    logout as userLogout,
    getCurrentUser,
    tokenLogin,
    // tokenLogin
} from './auth.api';


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        
        const checkAuth = async () => {

            try {
                const data = await getCurrentUser();
                setUser(data.user);

            }
            catch (err) {

                if(err.status !== 401){
                    setUser(null);
                    console.log("Auth Failed" , err.message);
                    return 
                }

                try{

                    await tokenLogin();
                    const user = await getCurrentUser();

                    setUser(user.user);
                    console.log("Logged in again")
                }
                catch{
                    
                    setUser(null);
                    return <p>You are not Authenticated , Please login!</p>
                }

            }
            finally {
                setLoading(false);
            }

        }

        checkAuth();

    }, []);

    const login = async (credentials) => {

        try{

            setLoading(true);
            const data = await userLogin(credentials);
            const userData = await getCurrentUser();
            setUser(userData.user);
            setLoading(false);
            return data;
        }
        finally{
            setLoading(false);
        }

    }

    const logout = async () => {
        await userLogout();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user, loading, login, logout , setUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }
export default AuthContext;

