import { useEffect, useState } from "react";
import { getProducts as GP, addProducttoCart } from "../product.api";
import ProductCard from "./ProductCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import Styles from "./ProductCard.module.css";

const ProductList = () => {

    const [products, setProducts] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";

    const navigate = useNavigate();

    const cartHandler = async (product) => {

        try {

            await addProducttoCart({
                productId: product._id,
                quantity: 1
            });

            alert("Product Added to Cart!");

        }
        catch (err) {

            console.error("Unable to add product:", err);

            alert(`Unable to add! Reason: ${err.message}`);

        }
    };


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await GP({
                    page: 1,
                    limit: 10,
                    search,
                    sort
                });

                setProducts(response.products);

            }
            catch (err) {

                console.error("Failed to fetch Products:", err);

                setProducts([]);

            }
        };

        fetchProducts();

    }, [search, sort]);


    const handleSpecificProduct = (product) => {

        navigate(`/product/${product._id}`);

    };


    const handleSort = (e) => {

        const selectedSort = e.target.value;

        const params = new URLSearchParams(searchParams);

        if (selectedSort) {
            params.set("sort", selectedSort);
        }
        else {
            params.delete("sort");
        }

        params.set("page", "1");

        setSearchParams(params);

    };


    return (
        <div>

            <div className={Styles.sortContainer}>

                <label htmlFor="sort">
                    Sort By:
                </label>

                <select
                    id="sort"
                    value={sort}
                    onChange={handleSort}
                >

                    <option value="">
                        Default
                    </option>

                    <option value="price_asc">
                        Price: Low to High
                    </option>

                    <option value="price_desc">
                        Price: High to Low
                    </option>

                </select>

            </div>


            <div className={Styles.container}>

                {
                    products.length > 0

                        ?

                        products.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                                addToCart={cartHandler}
                                IndividualProduct={handleSpecificProduct}
                            />

                        ))

                        :

                        <h1>Products not Available!</h1>
                }

            </div>

        </div>
    );
};

export default ProductList;