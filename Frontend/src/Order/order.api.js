import { authApiClient } from "../services/authApiClient"

export const checkOutDetails = async (orderType) => {

    return await authApiClient('/order/checkout' , {
        method: "POST",
        body: JSON.stringify(orderType)
    })
}


export const placeOrder = async (orderDetails) => {

    return await authApiClient('/order/place-order' , {
        method: "POST",
        body: JSON.stringify({orderDetails: orderDetails})
    })
}