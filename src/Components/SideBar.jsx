import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaStore,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <FaBox />,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <FaShoppingCart />,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <FaUsers />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
];

function SideBar() {
  const navigate = useNavigate();

  return (
    <aside
      className="bg-dark text-white d-flex flex-column"
      style={{
        minHeight: "100vh",
        padding: "24px 16px",
      }}
    >
      {/* Logo / Brand */}
      <div className="mb-4 px-2">
        <h2 className="fw-bold mb-1">
          NovaMart
        </h2>

        <small className="text-secondary">
          ADMIN PANEL
        </small>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="nav flex-column gap-2">

          {menuItems.map((item) => (
            <li
              className="nav-item"
              key={item.path}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center rounded px-3 py-2 ${
                    isActive
                      ? "bg-primary text-white fw-semibold"
                      : "text-white"
                  }`
                }
                style={{
                  transition: "all 0.2s ease",
                }}
              >
                <span className="me-3">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}

        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">

        <hr className="border-secondary" />

        <button
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={() => navigate("/")}
        >
          <FaStore />
          Back to Store
        </button>

      </div>
    </aside>
  );
}

export default SideBar;