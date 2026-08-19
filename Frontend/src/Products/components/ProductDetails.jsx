import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./ProductDetails.module.css";
import AddressForm from "../../Auth/component/AddressForm";
import { userDetails } from "../../Auth/auth.api";

const ProductDetails = ({ product, addToCart }) => {

    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const increaseQuantity = () => {
        if (quantity < 5) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleBuyNow = async () => {

        const user = await userDetails();
        const address = user.userDetails.address;

        if (!address || !address.name || !address.area) {
            setShowAddressForm(true);
            return;
        }

        navigate("/checkout", {
            state: {
                orderType: "buyNow",
                productId: product._id,
                quantity: quantity
            }
        });
    };

    if (showAddressForm) {
        return (<AddressForm />)
    }

    return (
        <main className={Styles.page}>

            <div className={Styles.productContainer}>

                {/* LEFT - IMAGE */}
                <div className={Styles.imageSection}>
                    <div className={Styles.imageWrapper}>
                        <img
                            src={product.image.url}
                            alt={`${product.color} ${product.fabric}`}
                        />
                    </div>
                </div>


                {/* RIGHT - DETAILS */}
                <div className={Styles.detailsSection}>

                    <p className={Styles.category}>
                        {product.fabric}
                    </p>

                    <h1>
                        {product.color} {product.fabric}
                    </h1>

                    <p className={Styles.productId}>
                        Product ID: {product._id}
                    </p>

                    <div className={Styles.price}>
                        ₹{product.price}
                    </div>

                    <div className={Styles.separator}></div>


                    {/* PRODUCT INFORMATION */}
                    <div className={Styles.info}>

                        <div>
                            <span>Color</span>
                            <strong>{product.color}</strong>
                        </div>

                        <div>
                            <span>Fabric</span>
                            <strong>{product.fabric}</strong>
                        </div>

                        <div>
                            <span>Size</span>
                            <strong>{product.size}</strong>
                        </div>

                    </div>


                    {/* QUANTITY */}
                    <div className={Styles.quantitySection}>

                        <span>Quantity</span>

                        <div className={Styles.quantityControl}>

                            <button
                                onClick={decreaseQuantity}
                            >
                                −
                            </button>

                            <span>{quantity}</span>

                            <button
                                onClick={increaseQuantity}
                            >
                                +
                            </button>

                        </div>

                    </div>


                    {/* TOTAL */}
                    <div className={Styles.itemTotal}>

                        <span>Item Total</span>

                        <strong>
                            ₹{product.price * quantity}
                        </strong>

                    </div>


                    {/* ACTIONS */}
                    <div className={Styles.actions}>

                        <button
                            className={Styles.cartButton}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>

                        <button
                            className={Styles.buyButton}
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>

                    </div>


                    {/* DELIVERY INFO */}
                    <div className={Styles.delivery}>

                        <div>
                            🚚
                            <span>
                                <strong>Delivery available</strong>
                                <small>
                                    Delivered to your address
                                </small>
                            </span>
                        </div>

                        <div>
                            💵
                            <span>
                                <strong>Cash on Delivery</strong>
                                <small>
                                    COD available
                                </small>
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default ProductDetails;