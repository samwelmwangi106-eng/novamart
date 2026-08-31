import SideBar from "../Components/SideBar";
import Topbar from "../Components/Topbar";

function AdminLayout({ children }) {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* Sidebar */}
        <aside className="col-lg-2">
          <SideBar />
        </aside>

        {/* Main Admin Area */}
        <main className="col-lg-10 bg-light min-vh-100">

          {/* Topbar */}
          <Topbar />

          {/* Page Content */}
          <div className="p-4">
            {children}
          </div>

        </main>

      </div>
    </div>
  );
}

export default AdminLayout;