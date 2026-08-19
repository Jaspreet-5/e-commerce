import AdminProductCard from "./AdminProductCard";
import { getProducts as GP } from "../../Products/product.api"
import { useEffect, useState } from "react";
import { deleteProduct, editProduct } from "../admin.api";

const AdminProducts = () => {

    
    const [loading , setLoading] = useState(false);

    const handleDelete = async (id) => {
        
        console.log(id)
        setLoading(true);
        let response;
        try{
            response = await deleteProduct(id);
            alert("Product Deleted Successfully!")
        }
        catch(err){
            alert("Failed to Delete Product!");
            console.error("Product Deletion Failed: ", err.message , err , response)
        }
        finally{
            setLoading(false);
        }
    }
    
    const handleEdit = async (id) => {
        setLoading(true);

        try{
            await editProduct(id);
            alert("Product Edit Successfully!");
        }
        catch(err){
            console.error(err.message);
            alert("Failed to Edit Product");
        }
        finally{
            setLoading(false);
        }
    }
    
    const [products, setProducts] = useState([]);

    useEffect(() => {

        const getProductList = async () => {

            try {
                const data = await GP();

                setProducts(data.products);
            }
            catch (err) {
                console.log("Product List Error:", err);
            }

        };

        getProductList();

    }, []);


    return (
        <div style={{display: "flex" , gap: "10px" , flexWrap: "nowrap" , width: "100%"}}>
            {
                products.map((product ) => {
                    return <AdminProductCard key={product._id} product={product} onDelete={handleDelete} onEdit={handleEdit} loading={loading}/>
                })
            }
        </div>
    )
}

export default AdminProducts
