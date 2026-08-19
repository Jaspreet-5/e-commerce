const API_URL = import.meta.env.VITE_API_URL;

const apiClient = async (endpoint , options={}) => {

    const response = await fetch(`${API_URL}${endpoint}` , {
 
        ...options,

        headers : {
            "Content-Type" : "application/json",
            ...options.headers
        },

        credentials : "include"
    })

    if(response.status === 204){
        return true;
    }

    const data = await response.json();

    if(!response.ok){
        const error = new Error(data.message || "Something went Wrong! Please try again later")
        error.status = response.status;
        error.details = data.error;
        throw error;
    }

    return data;

}

export default apiClient;