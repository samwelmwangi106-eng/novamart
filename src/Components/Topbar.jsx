import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

import React from 'react'

function Topbar() {
  return (
    <nav className="navbar bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
            <div className="input-group" style={{width: "300px"}}>
                <span className="input-group-text bg-light border-0">
                    <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search..."
                />
            </div>
        </div>
        <div className="d-flex align-items-center gap-4">
            <FaBell size={20}/>
            <div className="d-flex align-items-center gap-2">
                <FaUserCircle size={35} />
                <span>Admin</span>
            </div>
        </div>
    </nav>
  )
}

export default Topbar
