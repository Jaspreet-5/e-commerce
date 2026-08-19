import { useEffect, useState } from "react";
import CartCard from "./CartCard";
import Styles from "../cart.module.css";
import { getCart, removeProduct, updateProductQuantity } from "../cart.api";
import { useNavigate } from "react-router-dom";
import { userDetails } from "../../Auth/auth.api";
import AddressForm from "../../Auth/component/AddressForm";

const CartProducts = () => {

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleCartCheckout = async () => {

        try {
            const user = await userDetails();
            const address = user.userDetails.address;

            if (!address || !address.name || !address.area) {
                setShowAddressForm(true);
                return;
            }
            navigate('/checkout' , {
                state : {
                    orderType: "cart",
                }
            })

        }
        catch (err) {
            console.log(err.message, err);
        }
    }

    const handleQuantityChange = async (productId, newQuantity, oldQuantity) => {
        newQuantity = Number(newQuantity);

        setCartProducts(cartProducts => cartProducts.map(product =>
            product.productId === productId
                ? { ...product, quantity: newQuantity, subTotal: newQuantity * product.price }
                : product
        ))

        try {
            await updateProductQuantity({ productId, newQuantity });
            console.log("Done", cartProducts)
        }
        catch (err) {

            setCartProducts(cartProducts => cartProducts.map(product =>
                product.productId === productId
                    ? { ...product, quantity: oldQuantity, subTotal: oldQuantity * product.price }
                    : product
            ))

            alert("Failed to change quantity", err.message)
        }
    }

    const deleteCartProduct = async (productId) => {



        try {
            await removeProduct(productId);
            setCartProducts(cartProducts => cartProducts.filter(product =>
                product.productId !== productId
            ))
        }
        catch (err) {
            console.error("Failed to Delete: ", err.message)
            alert("Failed to remove");

        }
    }

    useEffect(() => {

        const fetchCart = async () => {

            try {
                const data = await getCart();

                setCartProducts(data.cartProducts || []);

            } catch (err) {

                console.error("Failed to fetch cart:", err);

            } finally {

                setLoading(false);

            }
        };

        fetchCart();

    }, []);



    if (loading) {
        return <p>Loading cart...</p>;
    }


    if (!cartProducts.length) {
        return (
            <div>
                <h2>Your Cart is Empty</h2>
                <p>Add some products to your cart.</p>
            </div>
        );
    }

    let total = 0; // total is same as subTotal because delivery is free
    cartProducts.map((product) => total += product.subTotal)


    return (
        <>
            {
                showAddressForm
                    ? <AddressForm />
                    :
                    <main>
                        <h2>Your Cart</h2>
                        <div className={Styles.container}>

                            <div className={Styles.leftSubContainer}>

                                {cartProducts.map((product) => (
                                    <CartCard
                                        key={product.productId}
                                        product={product}
                                        handleQuantityChange={handleQuantityChange}
                                        handleProductRemove={deleteCartProduct}
                                    />
                                ))}

                            </div>

                            <div className={Styles.rightSubContainer}>
                                <h2>Order Summary</h2>

                                <div className={Styles.orderSummary}>

                                    <div className={Styles.infoField}>
                                        <span>Sub-Total</span>
                                        <span >₹{total}</span>
                                    </div>

                                    <div className={Styles.infoField}>
                                        <span>Delivery Fee</span>
                                        <span style={{ color: "green", fontWeight: "600" }}>Free</span>
                                    </div>


                                    <span style={{ width: "100%", height: "1px", backgroundColor: "gray" }}></span>

                                    <div className={Styles.infoField}>
                                        <span>Total</span>
                                        <span className={Styles.orderSummaryPrice}>₹{total}</span>
                                    </div>

                                    <button onClick={handleCartCheckout}>Order Checkout</button>
                                </div>
                            </div>


                        </div>
                    </main>
            }
        </>
    );
};

export default CartProducts;