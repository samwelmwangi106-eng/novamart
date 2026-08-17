import React from 'react'

function OrderAnalytics({orders}) {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) = order.status === "Pending"
    ).length;

    const processingOrders = orders.filter(
        (order) = order.status === "Processing"
    ).length;

    const pendingOrders = orders.filter(
        (order) = order.status === "Pending"
    ).length;
    const shippedOrders = orders.filter(
        (order) = order.status === "Shipped"
    ).length;
    const deliveredOrders = orders.filter(
        (order) = order.status === "Delivered"
    ).length;
    
    const cancelledOrders = orders.filter(
        (order) = order.status === "Cancelled"
    ).length;
    
  return (
    <div className='mb-5'>
        <h4 className='mb-4'>
            Order Analytics
        </h4>
      <div className='row g-4'>
        {/* Total Orders */}
        <div className='col-md-4 col-lg'>
            <div className='card shawdow-sm border-0 h-100'>
                <div className='card-body'>
                    <h6 className='text-muted'>
                        Total Orders

                    </h6>
                    <h3 className='mb-0'>
                        {totalOrders}
                    </h3>
                </div>
            </div>
        </div>
        {/* Pending */}
        <div className='col-md-4 col-lg'>
            <div className='card shawdow-sm border-0 h-100'>
                <div className='card-body'>
                    <h6 className='text-muted'>
                        Pending
                    </h6>
                    <h3 className='mb-0'>
                        {pendingOrders}
                    </h3>
                </div>
            </div>
        </div>
        {/* Processing */}
        <div className='col-md-4 col-lg'>
            <div className='card shawdow-sm border-0 h-100'>
                <div className='card-body'>
                    <h6 className='text-muted'>
                        Processing
                    </h6>
                    <h3 className='mb-0'>
                        {processingOrders}
                    </h3>
                </div>
            </div>
        </div>
        {/* Shipped */}
        <div className='col-md-4 col-lg'>
            <div className='card shawdow-sm border-0 h-100'>
                <div className='card-body'>
                    <h6 className='text-muted'>
                       Shipped

                    </h6>
                    <h3 className='mb-0'>
                        {shippedOrders}
                    </h3>
                </div>
            </div>
        </div>
        {/* Delivered */}
        <div className='col-md-4 col-lg'>
            <div className='card shawdow-sm border-0 h-100'>
                <div className='card-body'>
                    <h6 className='text-muted'>
                        Delivered

                    </h6>
                    <h3 className='mb-0'>
                        {deliveredOrders}
                    </h3>
                </div>
            </div>
        </div>
        {/* Cancelled */}
        <div className='col-md-4 col-lg'>
            <div className='card shawdow-sm border-0 h-100'>
                <div className='card-body'>
                    <h6 className='text-muted'>
                        Cancelled

                    </h6>
                    <h3 className='mb-0'>
                        {cancelledOrders}
                    </h3>
                </div>
            </div>
        </div>
        
        
        
       

        

      </div>
    </div>
  )
}

export default OrderAnalytics
