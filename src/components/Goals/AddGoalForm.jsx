import React, { useState } from 'react'
import { LuX, LuTarget, LuTrendingUp } from 'react-icons/lu'
import Modal from '../Modal'
import Input from '../inputs/Input'

const AddGoalForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: 'savings',
    priority: 'medium',
    duration: 'short_term',
    targetAmount: '',
    targetDate: '',
    category: ''
  })

  const goalTypes = [
    { value: 'savings', label: 'Savings' },
    { value: 'debt_payoff', label: 'Debt Payoff' },
    { value: 'expense_reduction', label: 'Expense Reduction' },
    { value: 'investment', label: 'Investment' },
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'other', label: 'Other' }
  ]

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const durations = [
    { value: 'short_term', label: 'Short Term (Weekly/Monthly)' },
    { value: 'long_term', label: 'Long Term (6-12 months)' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }



  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title || !formData.goalType || !formData.targetAmount || !formData.targetDate) {
      alert('Please fill in all required fields')
      return
    }

    const submitData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount)
    }

    onSubmit(submitData)
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Goal">
      <form onSubmit={handleSubmit} className='max-h-[80vh] overflow-y-auto'>
        <div className='p-4 sm:p-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-white flex items-center gap-2'>
              <LuTarget className='w-5 h-5' />
              Basic Information
            </h3>

            <Input
              value={formData.title}
              onChange={({ target }) => handleInputChange({ target: { name: 'title', value: target.value } })}
              label="Goal Title *"
              placeholder="e.g., Emergency Fund"
              type="text"
            />

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className='input-control'
                placeholder='Describe your goal...'
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className="input-group">
                <label className="input-label">Goal Type *</label>
                <select
                  name='goalType'
                  value={formData.goalType}
                  onChange={handleInputChange}
                  className='input-control'
                  required
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Priority *</label>
                <select
                  name='priority'
                  value={formData.priority}
                  onChange={handleInputChange}
                  className='input-control'
                  required
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Duration *</label>
              <select
                name='duration'
                value={formData.duration}
                onChange={handleInputChange}
                className='input-control'
                required
              >
                {durations.map(duration => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-white flex items-center gap-2'>
              <LuTrendingUp className='w-5 h-5' />
              Target Information
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input
                value={formData.targetAmount}
                onChange={({ target }) => handleInputChange({ target: { name: 'targetAmount', value: target.value } })}
                label="Target Amount (₹) *"
                placeholder="50000"
                type="number"
              />

              <Input
                value={formData.targetDate}
                onChange={({ target }) => handleInputChange({ target: { name: 'targetDate', value: target.value } })}
                label="Target Date *"
                placeholder=""
                type="date"
              />
            </div>

            {(formData.goalType === 'expense_reduction') && (
              <Input
                value={formData.category}
                onChange={({ target }) => handleInputChange({ target: { name: 'category', value: target.value } })}
                label="Category to Reduce"
                placeholder="e.g., Food & Dining"
                type="text"
              />
            )}
          </div>



          {/* Actions */}
          <div className='flex justify-end mt-6'>
            <button
              type='submit'
              className='add-btn add-btn-fill'
            >
              Create Goal
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default AddGoalForm
