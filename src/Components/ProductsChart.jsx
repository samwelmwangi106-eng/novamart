import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,CartesianGrid } from 'recharts'
function ProductsChart({ products}) {
    const categoryCounts = {};
    products.forEach((product) => {
        const category = product.category;

        categoryCounts[category] = (categoryCounts[category] || 0) +1;
    });
    const chartData = Object.entries(categoryCounts).map(
        ([category, count]) => (
            {
                category,
                products: count,

            }
        )
    )
    console.log(chartData);

  return (
    <div className="card shadow-sm mt-4">
        <div className='card-body'>
            <h4 className='mb-4'>
                Products by category
            </h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="category"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar
                    dataKey="products"
                    fill='#0d6efd'
                    />

                   

                </BarChart>

            </ResponsiveContainer>
        </div>
      
    </div>
  )
}

export default ProductsChart
