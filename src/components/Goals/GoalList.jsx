import React, { useState } from 'react'
import { LuTarget, LuCalendar, LuTrendingUp, LuEdit, LuTrash2, LuPlus, LuCheckCircle, LuClock } from 'react-icons/lu'
import Modal from '../Modal'
import GoalCard from './GoalCard'

const GoalList = ({
  goals,
  loading,
  onUpdateGoal,
  onDeleteGoal,
  onUpdateProgress,
  onGetInsights,
  onSelectGoal
}) => {
  const [deleteModal, setDeleteModal] = useState({ show: false, goal: null })

  const handleDelete = (goal) => {
    setDeleteModal({ show: true, goal })
  }

  const confirmDelete = () => {
    if (deleteModal.goal) {
      onDeleteGoal(deleteModal.goal._id)
      setDeleteModal({ show: false, goal: null })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className='text-center py-12'>
        <LuTarget className='mx-auto h-12 w-12 text-gray-400 mb-4' />
        <h3 className='text-lg font-medium text-gray-900 mb-2'>No goals yet</h3>
        <p className='text-gray-500 mb-4'>Start by creating your first financial goal</p>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {goals.map((goal) => (
          <GoalCard
            key={goal._id}
            goal={goal}
            onEdit={() => onSelectGoal(goal)}
            onDelete={() => handleDelete(goal)}
            onUpdateProgress={onUpdateProgress}
            onGetInsights={onGetInsights}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, goal: null })}
        title="Delete Goal"
      >
        <div className='p-6'>
          <p className='text-gray-600 mb-4'>
            Are you sure you want to delete "{deleteModal.goal?.title}"? This action cannot be undone.
          </p>
          <div className='flex justify-end gap-3'>
            <button
              onClick={() => setDeleteModal({ show: false, goal: null })}
              className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default GoalList
