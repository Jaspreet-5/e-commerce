import { authApiClient } from "../services/authApiClient"

export const getCart = async () => {

    return await authApiClient('/cart/' , {
        method: "GET"
    })
}

export const updateProductQuantity = async (productData) => {

    return await authApiClient('/cart/updateProductQuantity' , {
        method: "PATCH",
        body: JSON.stringify(productData)
    })
}

export const removeProduct = async (productId) => {
    
    return await authApiClient('/cart/removeProduct' , {
        method: "DELETE",
        body: JSON.stringify({productId: productId})
    })
}