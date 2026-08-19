import { tokenLogin } from "../Auth/auth.api";
import apiClient from "./apiClient"

export const authApiClient = async (endpoint , options) => {

    try{
        return await apiClient(endpoint , options);
    }
    catch(err){

        console.log("Auth Error" , err.message)
        if(err.status !== 401){
            throw err;
        }

        if(endpoint === '/auth/me' || endpoint === '/auth/t/refresh'){
            throw err;
        }
        
        await tokenLogin();

        return await apiClient(endpoint , options);
    }
}