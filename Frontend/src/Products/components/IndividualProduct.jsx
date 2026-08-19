import { useParams } from 'react-router-dom'
import { addProducttoCart, getIndividualProduct } from '../product.api'

import { useEffect, useState } from 'react'
import ProductDetails from './ProductDetails'

const IndividualProduct = () => {

    const { productId } = useParams()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)

    const cartHandler = async (product) => {

        try {

            await addProducttoCart({
                productId: product._id,
                quantity: 1
            })

            alert("Product Added to Cart!")

        }
        catch (err) {

            console.error(err)
            alert("Unable to add!")
        }
    }

    useEffect(() => {

        const getProduct = async () => {

            setLoading(true)

            try {

                const response = await getIndividualProduct(productId)

                setProduct(response.product)

            }
            catch (err) {

                console.error(err.message)
            }
            finally {

                setLoading(false)
            }
        }

        getProduct()

    }, [productId])


    if (loading || !product) {
        return <h2>Fetching Product...</h2>
    }


    return (
        <div>
            <ProductDetails
            product={product}
            addToCart={cartHandler}
            /> 
        </div>
    )
}

export default IndividualProduct