
import Styles from "../order.module.css"

const AddressCard = ({ address }) => {

    return (
        <div className={Styles.addressCard}>
            <h1>Shipping Details</h1>

            <div className={Styles.addrContainer}>
                <span>Name :</span>
                <span>{address.name}</span>

                <span>Phone Number :</span>
                <span>{address.phoneNo}</span>

                <span>Email :</span>
                <span>{address.email}</span>

                <span>Area :</span>
                <span>{address.area}</span>

                <span>Pincode :</span>
                <span>{address.pincode}</span>

                <span>City :</span>
                <span>{address.city}</span>

                <span>State :</span>
                <span>{address.state}</span>
            </div>
        </div>
    );
};

export default AddressCard;
