import SideBar from "../Components/SideBar";
import Topbar from "../Components/Topbar";

function AdminLayout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2 p-0">
          <SideBar />
        </div>

        <div className="col-lg-10 bg-light min-vh-100 p-0">
          <Topbar />
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout
