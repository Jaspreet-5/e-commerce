import { useRef, useState } from "react";
import useAuth from "../../Auth/useAuth";
import Styles from "../admin.module.css"
import { editProduct, uploadProducts } from "../admin.api";


const AdminProductUpload = ({ product = null }) => {

    const { user } = useAuth();

    const [color, setColor] = useState(product?.color || "");
    const [colorFamily, setColorFamily] = useState(
        product?.colorFamily || ""
    );
    const [price, setPrice] = useState(product?.price || "");
    const [fabric, setFabric] = useState(product?.fabric || "");
    const [size, setSize] = useState(product?.size || "");

    // This is ONLY for a newly selected image.
    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const inputElementRef = useRef(null);


    if (!user) {
        return <p>Checking Authentication...</p>;
    }


    if (user.role !== "admin") {
        return <p>You are not Authorized!</p>;
    }


    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!color || !colorFamily || !price || !fabric || !size) {
            alert("Please fill all fields of the form!");
            return;
        }


        // Image required only for CREATE
        if (!product && !image) {
            alert("Please select an Image!");
            return;
        }


        setLoading(true);


        try {

            const formData = new FormData();

            formData.append("color", color);
            formData.append("colorFamily", colorFamily);
            formData.append("price", price);
            formData.append("fabric", fabric);
            formData.append("size", size);


            if (image) {
                formData.append("image", image);
            }


            let response;


            if (product) {

                // EDIT
                response = await editProduct(
                    product._id,
                    formData
                );

            } else {

                // CREATE
                response = await uploadProducts(
                    formData
                );

            }


            if (!response.ok) {
                console.log(response, response.ok)
                throw new Error(
                    `HTTP error! Status: ${response.status}`
                );
            }


            alert(
                product
                    ? "Product Updated Successfully!"
                    : "Product Uploaded Successfully!"
            );


            // Reset only CREATE form
            if (!product) {

                setColor("");
                setColorFamily("");
                setPrice("");
                setFabric("");
                setSize("");
                setImage(null);

                if (inputElementRef.current) {
                    inputElementRef.current.value = "";
                }
            }

        } catch (err) {

            console.error(
                product
                    ? "Failed to update product:"
                    : "Failed to upload product:",
                err
            );

            alert(
                product
                    ? "Failed to Update Product!"
                    : "Failed to Upload Product!"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className={Styles.container}>
            <form className={Styles.formContainer} onSubmit={handleSubmit}>

                <h2>
                    {product ? "Edit Product" : "Fill Product Details"}
                </h2>

                <label htmlFor="color">Color</label>
                <input
                    onChange={(event) => setColor(event.target.value)}
                    type="text"
                    name="color"
                    id="color"
                    // required
                    placeholder="Enter Color"
                    className={Styles.inputField}
                />

                <label htmlFor="colorFamily">ColorFamily</label>
                <input
                    onChange={(event) => setColorFamily(event.target.value)}
                    type="text"
                    name="colorFamily"
                    id="colorFamily"
                    // required
                    className={Styles.inputField}
                    placeholder="Enter ColorFamily"
                />

                <label htmlFor="price">Price</label>
                <input
                    onChange={(event) => setPrice(event.target.value)}
                    type="text"
                    name="price"
                    id="price"
                    // required
                    className={Styles.inputField}
                    placeholder="Enter Price"
                />

                <fieldset>
                    <legend>Select Fabric :</legend>

                    <div className={Styles.radioField}>

                        <label>
                            <input
                                type="radio"
                                name="fabric"
                                value="Full-Voil"
                                onChange={(event) => setFabric(event.target.value)}
                            />
                            <span>Full-Voil</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="fabric"
                                value="Rubia"
                                onChange={(event) => setFabric(event.target.value)}
                            />
                            <span>Rubia</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="fabric"
                                value="Mix"
                                onChange={(event) => setFabric(event.target.value)}
                            />
                            <span>Mix</span>
                        </label>

                    </div>
                </fieldset>


                <fieldset>
                    <legend>Select Length :</legend>

                    <div className={Styles.radioField}>

                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="5"
                                onChange={(event) => setSize(event.target.value)}
                            />
                            <span>5 Meter</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="5.5"
                                onChange={(event) => setSize(event.target.value)}
                            />
                            <span>5.5 Meter</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="6"
                                onChange={(event) => setSize(event.target.value)}
                            />
                            <span>6 Meter</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="6.5"
                                onChange={(event) => setSize(event.target.value)}
                            />
                            <span>6.5 Meter</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="7"
                                onChange={(event) => setSize(event.target.value)}
                            />
                            <span>7 Meter</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="7.5"
                                onChange={(event) => setSize(event.target.value)}
                            />
                            <span>7.5 Meter</span>
                        </label>

                    </div>
                </fieldset>


                <label htmlFor="image">
                    {product
                        ? "Choose New Image (optional)"
                        : "Choose Image"}
                </label>

                <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    ref={inputElementRef}
                    onChange={(event) => setImage(event.target.files[0])}
                    required={!product}
                />

                <button
                    className={Styles.btn}
                    type="submit"
                    disabled={loading}>
                    {
                        loading
                            ? product
                                ? "Updating Product..."
                                : "Uploading Product..."

                            : product
                                ? "Update Product"
                                : "Submit"
                    }
                </button>

            </form>

        </div>
    )
}

export default AdminProductUpload;
