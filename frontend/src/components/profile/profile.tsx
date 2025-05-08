import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaLock, FaBell, FaWallet } from "react-icons/fa";
import './profile.css';

const ProfileฺBar: React.FC = () => {
    // const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();
    // const location = useLocation();

    const menus = [
        { label: "Profile", path: `/profile/${id}`, icon: <FaUser /> },
        { label: "Addresses", path: `/address/${id}`, icon: <FaMapMarkerAlt /> },
        { label: "Change Password", path: `/password/${id}`, icon: <FaLock /> },
        { label: "Notifications", path: `/notifications/${id}`, icon: <FaBell /> },
        { label: "My Wallet", path: `/wallet/${id}`, icon: <FaWallet /> },
    ];

    // useEffect(() => {
    //     // Perform fetch or reload logic whenever the location changes
    //     fetchData(location.pathname);
    // }, [location]);

    // const fetchData = async (path: string) => {
    //     try {
    //         // Run 3 fetch operations in sequence
    //         for (let i = 1; i <= 3; i++) {
    //             const response = await fetch(`/api${path}`); // Replace with your actual API endpoint
    //             const data = await response.json();
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    return (
        <div className="profile-sidebar" style={{ width: "100%" }} >
            <ul style={{ maxWidth: "200px" }}>
                {menus.map((item, index) => (
                    <div key={index} className="profile-sidebar-menu" >
                        <Link to={item.path} className="menu-link">
                            {item.icon} {/* Render the icon */}
                            <span>{item.label}</span>
                        </Link>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default ProfileฺBar;
