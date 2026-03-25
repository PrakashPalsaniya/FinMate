import React from 'react'

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-sm leading-6 text-slate-600">{content}</p>
      <div className="mt-6 flex justify-end">
        <button
          type='button'
          className='btn-secondary !w-auto !rounded-full !border-red-100 !bg-red-50 !px-5 !text-red-600 hover:!border-red-200'
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteAlert
