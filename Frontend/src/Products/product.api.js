import apiClient from "../services/apiClient";
import { authApiClient } from "../services/authApiClient";


export const getProducts = async ({
    page = 1,
    limit = 10,
    search = "",
    colorFamily = "",
    fabric = "",
    size = "",
    minPrice = "",
    maxPrice = "",
    sort = ""
} = {}) => {

    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (search) params.set("search", search);
    if (colorFamily) params.set("colorFamily", colorFamily);
    if (fabric) params.set("fabric", fabric);
    if (size) params.set("size", size);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);

    return await authApiClient(
        `/services/products?${params.toString()}`,
        {
            method: "GET"
        }
    );
};

export const getIndividualProduct = async (productId) => {
    
    const response = await apiClient(`/services/product/${productId}` , {
        method: 'GET'
    });

    return response;

}


export const addProducttoCart = async (product) => {

    const response = await authApiClient('/cart/addProductToCart' , {
        method: "POST",
        body: JSON.stringify(product)
    })
    return response
}

export const clearCart = async () => {

    return await authApiClient('/cart/clearCart' , {
        method: "PATCH"
    })
}