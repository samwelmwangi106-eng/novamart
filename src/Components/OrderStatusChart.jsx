import React from 'react'
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis,Tooltip, CartesianGrid} from "recharts"

function OrderStatusChart( {orders}) {
    const statusCounts = {
        Pending: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
    };

    orders.forEach((order) => {
        if (statusCounts.hasOwnProperty(order.status)){
            statusCounts[order.status]++;
        }
    });

    const chartData = Object.entries(statusCounts).map(
        ([status, count]) => ({
            status,
            orders: count,
        })
    );
  return (
    <div className='card shawdow-sm border-0 mb-5'>
        <div className='card-body'>
            <h4 className='mb-4'>
                Orders by Status
                </h4>
                <ResponsiveContainer 
                width="100%"
                height={350}
                 >
                    <BarChart
                    data={chartData}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="status"/>
                        <YAxis allowDecimals={false}/>

                        <Tooltip/>

                        <Bar
                        dataKey="orders"
                        fill='#0d6efd'
                        radius={[5, 5, 0,0]}
                        />

                    </BarChart>
                 </ResponsiveContainer>
            

        </div>
      
    </div>
  )
}

export default OrderStatusChart
