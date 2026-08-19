
import styles from "./ProductCard.module.css"

const ProductCard = ({ product, addToCart , IndividualProduct}) => {



    return (

        <article className={styles.card} onClick={() => IndividualProduct(product)}>

            <div className={styles.imageWrapper}>
                <img
                    src={product.image.url}
                    alt={`${product.color} ${product.fabric}`}
                    className={styles.image}
                />
            </div>

            <div className={styles.details}>

                <div className={styles.titleRow}>
                    <h3>{product.color}</h3>
                    <span className={styles.price}>₹{product.price}</span>
                </div>

                <div className={styles.info}>
                    <span>
                        <strong>Fabric</strong>
                        {product.fabric}
                    </span>

                    <span>
                        <strong>Length</strong>
                        {product.size} Meter
                    </span>
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={() => addToCart(product)}
                        className={styles.cartButton}>
                        Add to Cart
                    </button>

                    <button className={styles.buyButton}>
                        Buy Now
                    </button>
                </div>

            </div>

        </article>
    );
};

export default ProductCard;
