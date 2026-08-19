import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getIndividualProduct } from "../../Products/product.api";
import AdminProductUpload from "../components/AdminProductUpload";

const AdminProductEditPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const data = await getIndividualProduct(id);

                console.log("Individual Product:", data);

                setProduct(data.product);

            } catch (err) {

                console.error("Failed to fetch product:", err);
                setError(err.message);

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);


    if (loading) {
        return <p>Loading Product...</p>;
    }


    if (error) {
        return (
            <div>
                <p>Failed to load product.</p>
                <p>{error}</p>

                <button onClick={() => navigate("/admin/products")}>
                    Back to Products
                </button>
            </div>
        );
    }


    if (!product) {
        return <p>Product not found!</p>;
    }


    return (
        <AdminProductUpload product={product} />
    );
};

export default AdminProductEditPage;