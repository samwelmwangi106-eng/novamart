import React from 'react'

function AlertMessage({type, message, onClose}) {
    if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`}>
        {message}

        <button type='button'
        className='btn-close'
        onClick={onClose}
        >

        </button>
      
    </div>
  )
}

export default AlertMessage
