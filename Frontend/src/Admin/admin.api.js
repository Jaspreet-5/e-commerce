import { authApiClient } from "../services/authApiClient"

export const uploadProducts = async (formData) => {

    const response = await fetch('http://localhost:3000/api/services/uploadProduct', {
        method: 'POST',
        body: formData,
        credentials: "include"
    })

    return response;
}

export const editProduct = async (productId, formData) => {

    return authApiClient(
        `/services/updateproduct/${productId}`,
        {
            method: "PATCH",
            body: formData,
            credentials: "include"
        }
    );
};

export const deleteProduct = async (id) => {

    return await authApiClient(
        `/services/deleteProduct/${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );
}