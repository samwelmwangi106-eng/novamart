import { FaPlus, FaDownload, FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";

function DashboardActions ({
    onAddProduct,
    onExport,
    onLowStock,
    onReset,
}){
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="mb-3">
                    Quick Actions
                </h5>
                <div className="d-flex flex-wrap gap-3">
                    <button className="btn bbtn-primary"
                    onClick={onAddProduct}
                    >
                        <FaPlus className="me-2"/>
                        Add Product
                    </button>
                    <button
                    className="btn btn-warning"
                    onClick={onLowStock}
                    >
                        <FaExclamationTriangle className="me-2"/>
                        Low Stock
                    </button>
                    <button
                    className="btn btn-success"
                    onClick={onExport} >
                    Export Inventory
                    </button>


                    <button 
                    className="btn btn-danger"
                    onClick={onReset}
                    >
                        <FaSyncAlt className="me-2"/>
                        Reset Inventory
                    </button>

                </div>

            </div>

        </div>
    );
}
export default DashboardActions;