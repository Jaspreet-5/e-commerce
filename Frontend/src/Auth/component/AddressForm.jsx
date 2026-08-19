
import { useState } from "react"
import { updateAddress } from "../auth.api"
import Styles from "./Form.module.css"
import { useNavigate } from "react-router-dom"

const AddressForm = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [phoneNo, setPhoneNo] = useState("")
    const [email, setEmail] = useState("")
    const [area, setArea] = useState("")
    const [pincode, setPincode] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")

    const handleAddressForm = async (e) => {

        e.preventDefault();

        const address = {
            name,
            phoneNo,
            email,
            area,
            pincode,
            city,
            state,
            country
        }
        try{
            const response = await updateAddress(address)
            alert("Address update successfully")
            navigate('/checkout')
            console.log(response)
        }
        catch(err){
            alert("Failed to save address")
            console.log(err.message , err);
        }
    }

    return (
        <div className={Styles.container}>

            <form onSubmit={handleAddressForm} className={Styles.form}>


                <div className={Styles.formField}>

                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Enter Full-Name" required
                        onChange={(e) => setName(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="phoneNo">Phone Number</label>
                    <input type="text" id="phoneNo" placeholder="Enter PhoneNo" required onChange={(e) => setPhoneNo(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="example@gmail.com" required onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="street">Area</label>
                    <input type="text" id="street" placeholder="Enter Street or Area" required onChange={(e) => setArea(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="pincode">Pincode</label>
                    <input type="text" id="pincode" placeholder="Enter Pincode" required onChange={(e) => setPincode(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="city">City</label>
                    <input type="text" id="city" placeholder="Enter City" required onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="state">State</label>
                    <input type="text" id="state" placeholder="Enter State" required onChange={(e) => setState(e.target.value)} />
                </div>

                <div className={Styles.formField}>

                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" placeholder="Enter Country" required onChange={(e) => setCountry(e.target.value)} />
                </div>

                <button type="submit" className={Styles.button}>
                    Submit
                    </button>

            </form>

        </div>
    )
}

export default AddressForm
