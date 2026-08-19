import Styles from "../cart.module.css";

const CartCard = ({ product, handleQuantityChange, handleProductRemove }) => {

    return (
        <>
            <div className={Styles.productWrapper}>

                <div className={Styles.imageWrapper}>
                    <img src={product.imageUrl} alt="" width="200px" />
                </div>

                <div className={Styles.infoWrapper}>

                    <div> Color : </div>
                    <span> {product.color}</span>

                    <div>Fabric : </div>
                    <span>{product.fabric}</span>

                    <div>Length : </div>
                    <span>{product.size}</span>

                    <label style={{ fontWeight: "600" }} htmlFor="quantity">Quantity : </label>
                    <select
                        name="quantity"
                        id="quantity"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.productId, Number(e.target.value))
                        }>

                        {Array.from({ length: 10 }, (_, index) => {
                            const value = index + 1;

                            return (
                                <option
                                    key={value}
                                    value={value}>
                                    {value}
                                </option>
                            )
                        })}

                    </select>

                    <div> Price : </div>
                    <span style={{ fontWeight: "bolder", fontSize: "20px" }}>₹{product.price}</span>

                    <div style={{ fontSize: "larger" }}> Total : </div>
                    <span style={{ fontWeight: "bolder", fontSize: "22px" , color: "black"}}>₹{product.price * product.quantity}</span>

                    <span></span>
                    <button
                        onClick={() => handleProductRemove(product.productId)} >
                        Remove
                    </button>

                </div>

            </div>
        </>
    );
};

export default CartCard;