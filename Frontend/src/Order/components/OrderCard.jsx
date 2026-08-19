import { useLocation, useNavigate } from "react-router-dom";
import { userDetails as UD } from "../../Auth/auth.api.js";
import { checkOutDetails, placeOrder } from "../order.api.js";
import Styles from "../order.module.css";
import AddressCard from "./AddressCard.jsx";
import { useState, useEffect } from "react";
import { getCart } from "../../Cart/cart.api.js";
import { getIndividualProduct } from "../../Products/product.api.js";

const OrderCart = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // READ IT DIRECTLY. DO NOT USE setOrderType().
    const orderType = location.state?.orderType;

    const [address, setAddress] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [amount, setAmount] = useState(0);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {

        const fetchCheckoutData = async () => {

            try {

                if (!orderType) {
                    alert("Invalid order request!");
                    return;
                }

                // -----------------------------
                // USER / ADDRESS
                // -----------------------------

                const userResponse = await UD();

                setAddress(userResponse.userDetails.address);
                setUserDetails(userResponse);


                // -----------------------------
                // CHECKOUT SUMMARY
                // -----------------------------

                let checkoutResponse;

                if (orderType === "cart") {

                    checkoutResponse = await checkOutDetails({
                        orderType: "cart"
                    });

                }
                else if (orderType === "buyNow") {

                    const productId = location.state?.productId;
                    const quantity = Number(location.state?.quantity);

                    if (!productId || !quantity || quantity < 1) {
                        alert("Invalid Buy Now request!");
                        return;
                    }

                    checkoutResponse = await checkOutDetails({
                        orderType: "buyNow",
                        productId: productId,
                        quantity: quantity
                    });

                }
                else {

                    alert("Invalid order type!");
                    return;
                }

                console.log("Checkout Summary:", checkoutResponse);

                setAmount(Number(checkoutResponse.totalPrice) || 0);

            }
            catch (err) {

                console.error("Checkout loading failed:", err);

                alert("Failed to load checkout details!");

            }
        };

        fetchCheckoutData();

    }, [orderType, location.state]);


    const handlePlaceOrder = async () => {

        if (!paymentMode) {
            alert("Please select payment mode");
            return;
        }

        if (!orderType) {
            alert("Invalid order request!");
            return;
        }

        if (!userDetails || !address) {
            alert("User details are still loading!");
            return;
        }


        const orderDetails = {

            userId: userDetails.userDetails._id,

            items: [],

            subtotal: 0,
            deliveryCharge: 0,
            total: 0,

            paymentMethod: paymentMode,
            paymentStatus: "pending",
            orderStatus: "placed",

            shippingAddress: address
        };


        // =====================================================
        // CART ORDER
        // =====================================================

        if (orderType === "cart") {

            try {

                const response = await getCart();

                if (!response.cartProducts?.length) {
                    alert("Your cart has no products!");
                    return;
                }

                response.cartProducts.forEach((product) => {

                    const itemSubtotal = Number(product.subTotal);

                    orderDetails.items.push({

                        productId: product.productId,

                        quantity: Number(product.quantity),

                        price: Number(product.price),

                        subtotal: itemSubtotal
                    });

                    orderDetails.subtotal += itemSubtotal;
                });

            }
            catch (err) {

                console.error("Failed to get cart:", err);

                alert("Failed to get cart! Please retry");

                return;
            }
        }


        // =====================================================
        // BUY NOW ORDER
        // =====================================================

        else if (orderType === "buyNow") {

            const productId = location.state?.productId;
            const quantity = Number(location.state?.quantity);

            if (!productId || !quantity || quantity < 1) {

                alert("Invalid product or quantity!");

                return;
            }

            try {

                const response = await getIndividualProduct(productId);

                console.log("Buy Now Product:", response);

                const product = response.product;

                if (!product) {

                    alert("Product may not be available!");

                    return;
                }

                const subtotal = quantity * Number(product.price);

                orderDetails.items.push({

                    productId: product._id,

                    quantity: quantity,

                    price: Number(product.price),

                    subtotal: subtotal
                });

                orderDetails.subtotal = subtotal;

            }
            catch (err) {

                console.error("Failed to get product:", err);

                alert("Product may not be available!");

                return;
            }
        }


        else {

            alert("Invalid order type!");

            return;
        }


        // =====================================================
        // FINAL TOTAL
        // =====================================================

        orderDetails.total =
            orderDetails.subtotal +
            orderDetails.deliveryCharge;


        console.log("FINAL ORDER:", orderDetails);


        // =====================================================
        // PLACE ORDER
        // =====================================================

        try {

            await placeOrder(orderDetails);

            alert(
                "Order Placed, We will call you shortly for order confirmation!"
            );
            navigate('/products' , {replace:true});
        

        }
        catch (err) {

            console.error("Failed to place order:", err);

            alert("Order Failed to Place");
        }
    };


    if (!address || !userDetails) {

        return <p>Loading checkout details...</p>;
    }


    return (

        <div className={Styles.container}>

            <AddressCard address={address} />


            <fieldset>

                <h1>Select Mode of Payment</h1>

                <label>

                    <input
                        id="COD"
                        name="paymentMode"
                        type="radio"
                        value="COD"
                        checked={paymentMode === "COD"}
                        onChange={(e) =>
                            setPaymentMode(e.target.value)
                        }
                    />

                    <span>
                        COD (Cash on Delivery)
                    </span>

                </label>


                <label>

                    <input
                        id="UPI"
                        name="paymentMode"
                        type="radio"
                        value="UPI"
                        checked={paymentMode === "UPI"}
                        onChange={(e) =>
                            setPaymentMode(e.target.value)
                        }
                    />

                    <span>
                        UPI (Scan and Pay from GPay, PhonePe, Paytm)
                    </span>

                </label>

            </fieldset>


            <div className={Styles.summary}>

                <h1>Final Summary</h1>

                <div className={Styles.orderSummary}>

                    <div className={Styles.infoField}>

                        <span>
                            Sub-Total
                        </span>

                        <span>
                            ₹ {amount}
                        </span>

                    </div>


                    <div className={Styles.infoField}>

                        <span>
                            Delivery Fee
                        </span>

                        <span
                            style={{
                                color: "green",
                                fontWeight: "600"
                            }}
                        >
                            Free
                        </span>

                    </div>


                    <span
                        style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: "gray"
                        }}
                    />


                    <div className={Styles.infoField}>

                        <span>
                            Total
                        </span>

                        <span className={Styles.orderSummaryPrice}>
                            ₹ {amount}
                        </span>

                    </div>


                    <button onClick={handlePlaceOrder}>
                        Place Order
                    </button>

                </div>

            </div>

        </div>
    );
};

export default OrderCart;