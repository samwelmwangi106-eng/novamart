import React from 'react'

function OrderToolbar({
    search,
    setSearch,
    status,
    setStatus
}) {

  return (
    <div className='card shadow-sm mb-4'>
        <div className='card-body'>
            <div className='row'>
                {/* {Search} */}
                <div className='col-md-6'>
                    <input type="text" 
                    className='form-control'
                    placeholder='Serach customer or product'
                    value={search}
                    onChange={(e) => 
                        setSearch(e.target.value)
                    } />
                    </div>
                    {/* {Status filter} */}
                    <div className='col-md-6'>
                        <select 
                        className="form-select"
                        value={status}
                        onChange={(e) => 
                            setStatus(e.target.value)
                        }
                         >
                            <option >All</option>
                            <option >Pending</option>
                            <option >Processsing</option>
                            <option >Delivered</option>
                            <option >Cancelled</option>

                        </select>

                    </div>
            </div>
        </div>
      
    </div>
  )
}

export default OrderToolbar
