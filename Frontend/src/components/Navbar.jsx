import useAuth from "../Auth/useAuth"
import Styles from "./Navbar.module.css"
import cartSVG from "../Assets/shopping_cart_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
import { useNavigate } from "react-router-dom";
import { logout } from "../Auth/auth.api";
import { useEffect, useState } from "react";
import { getCart } from "../Cart/cart.api";



const Navbar = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [hasItems, setHasItems] = useState(false);
    const [search, setSearch] = useState("");


    //to display the badge over cart , if any items 
    useEffect(() => {
        const checkCart = async () => {
            try {
                const response = await getCart();
                setHasItems(response.cartProducts?.length > 0);
            } catch (err) {
                console.error("Failed to check cart:", err);
            }
        };

        checkCart();
    }, []);

    const handleSearch = (e) => {
        if(e.key === "Enter") {
            navigate(`/products?search=${encodeURIComponent(search)}`)
        }
    }

    const handleCartClick = async () => {
        navigate('/cart');
    }

    const handleLogin = async () => {
        navigate('/login');
    }

    const handleSignUp = async () => {
        navigate('/signup')
    }

    const handleLogOut = async () => {
        await logout()
            .then(() => navigate('/login', { replace: true }))
            .catch((err) => console.error(err))

    }

    return (
        <>
            <div className={Styles.navbar}>

                <div onClick={() => navigate('/', { replace: true })} style={{ fontWeight: "bolder", cursor: "pointer" }} className={`${Styles.preDot} ${Styles.logo}`}>
                    Trending.
                    <span className={Styles.afterDot}>Turbans</span>
                </div>

                <div className={Styles.searchBar}>

                    <input
                    onKeyDown={handleSearch}
                    onChange={(e) => setSearch(e.target.value)}
                        className={Styles.inputField} type="text"
                        value={search} placeholder="Search by color, fabric only " />

                </div>

                <div className={Styles.cartSection}>
                    {
                        user ? <>
                            <button onClick={handleLogOut} className={Styles.btn} type="button">LogOut</button>

                        </> :
                            <div className={Styles.btnContainer}>
                                <button onClick={handleLogin} className={Styles.btn} type="button">Login</button>
                                <button onClick={handleSignUp} className={Styles.btn} type="button">SignUp</button>
                            </div>
                    }


                    <div className={Styles.cart}>
                        {hasItems && <div className={Styles.banner}></div>}
                        <img onClick={handleCartClick} src={cartSVG} alt="Cart" />

                    </div>
                </div>

            </div>
            <div className={Styles.line}></div>
        </>
    )
}

export default Navbar
