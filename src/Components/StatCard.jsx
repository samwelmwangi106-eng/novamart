import React from 'react'

function StatCard({ title, value, icon, bgColor}) {
  return (
    <div className='card border-0 shadow-sm'>
        <div className='card-body d-flex justify-content-between align-items-center'>
            <div>
                <h6 className='text-muted'>{title}</h6>
                <h3>{value}</h3>
            </div>
            <div className={`${bgColor} text-white rounded-circle d-flex justify-content-center align-items-center`}  style={{width: "60px", height: "60px", fontSize: "24px"}}>
                {icon}
            

            </div>
        </div>
      
    </div>
  )
}

export default StatCard
