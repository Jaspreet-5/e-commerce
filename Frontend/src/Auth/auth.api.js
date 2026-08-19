import apiClient from "../services/apiClient";
import { authApiClient } from "../services/authApiClient";

export const login = async (credentials) => {

    const data = await apiClient('/auth/login' , {
        method: 'POST',

        body: JSON.stringify(credentials)
    })

    return data;
}

export const signup = async (credentials) => {
    
    const data = await apiClient('/auth/signup' , {
        method: 'POST',
        body: JSON.stringify(credentials)
    })

    return data;
}

export const getCurrentUser = async () => {

    const currentUser = await apiClient('/auth/me' );
    console.log("Current User : ", currentUser)
    return currentUser
}

export const logout = async () => {
    return await apiClient('/auth/logout' , {
        method: 'POST'
    })
}

export const tokenLogin = async () => {
    return await apiClient('/auth/t/refresh') , {
        method: 'GET'
    }
}

export const userDetails = async () => {

    return await authApiClient('/auth/user/details' , {
        method: 'GET'
    })
}

export const updateAddress = async (address) => {

    return await authApiClient('/auth/user/updateAddress' , {
        method: 'PATCH',
        body: JSON.stringify({address})
    })
}