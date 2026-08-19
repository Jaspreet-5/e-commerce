
import { useNavigate } from "react-router-dom";
import styles from "../../Products/components/ProductCard.module.css"


const AdminProductCard = ({ product, onDelete, loading }) => {

    const navigate = useNavigate();
    
    return (
        <article className={styles.card}>

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
                    <span className={styles.price}>
                        ₹{product.price}
                    </span>
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

                <div className={styles.adminActions}>

                    <button
                        className={styles.editButton}
                        onClick={() =>
                            navigate(`/admin/products/${product._id}/edit`)
                        }
                    >
                        Edit
                    </button>

                    <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(product._id)}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>

            </div>

        </article>
    );
};

export default AdminProductCard
