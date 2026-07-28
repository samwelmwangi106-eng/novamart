function DashboardCard({ title, value, color }) {
  return (
    <div className="col-md-3 mb-4">
      <div className={`card border-${color} shadow-sm`}>
        <div className="card-body text-center">
          <h6 className="text-muted">{title}</h6>
          <h2 className={`text-${color}`}>{value}</h2>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;