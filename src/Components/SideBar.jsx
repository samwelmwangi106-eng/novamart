import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

// Helper function to determine the NavLink classes
function getNavLinkClass({ isActive }) {
  if (isActive) {
    return "nav-link bg-primary text-white rounded";
  }

  return "nav-link text-white";
}
const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />
  },
  {
    name: "Products",
    path: "/products",
    icon: <FaBox />
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <FaShoppingCart />
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <FaUsers />
  },
  {
    
    name: "Settings",
    path: "/settings",
    icon: <FaCog />
  
  }
  
]
function SideBar() {
  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
      <h2 className="mb-4">NovaMart</h2>

      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li className="nav-item mb-3" key={item.path}>
            <NavLink 
            to={item.path}
            className={getNavLinkClass}
            >
              <span className="me-2">
                {item.icon}

              </span>
              {item.name}

            </NavLink>

          </li>

        ))}
      </ul>
    </div>
  );
}

export default SideBar;