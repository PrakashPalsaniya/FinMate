import React, { useState } from 'react'
import { LuX, LuPlus, LuTrendingUp, LuBrain, LuTarget } from 'react-icons/lu'
import Modal from '../Modal'

const GoalProgress = ({ goal, onClose, onUpdateProgress, onGetInsights }) => {
  const [amount, setAmount] = useState('')
  const [insights, setInsights] = useState(null)
  const [showInsights, setShowInsights] = useState(false)
  const [loadingInsights, setLoadingInsights] = useState(false)

  const progressPercentage = goal.progressPercentage || 0

  const handleUpdateProgress = () => {
    if (amount && parseFloat(amount) > 0) {
      onUpdateProgress(goal._id, parseFloat(amount))
      setAmount('')
    }
  }

  const handleGetInsights = async () => {
    if (insights) {
      setShowInsights(!showInsights)
      return
    }

    try {
      setLoadingInsights(true)
      const data = await onGetInsights(goal._id)
      if (data) {
        setInsights(data)
        setShowInsights(true)
      }
    } catch (error) {
      console.error('Failed to get insights')
    } finally {
      setLoadingInsights(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Update Goal Progress">
      <div className='p-6 max-h-[80vh] overflow-y-auto'>
        {/* Goal Overview */}
        <div className='bg-gray-50 p-4 rounded-lg mb-6'>
          <div className='flex items-center gap-3 mb-3'>
            <LuTarget className='w-6 h-6 text-primary' />
            <h3 className='text-lg font-semibold text-gray-900'>{goal.title}</h3>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='text-sm text-gray-600'>Current Progress</p>
              <p className='text-xl font-bold text-gray-900'>{formatCurrency(goal.currentAmount)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Target Amount</p>
              <p className='text-xl font-bold text-gray-900'>{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mb-2'>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-sm font-medium text-gray-700'>Progress</span>
              <span className='text-sm text-gray-600'>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-primary h-3 rounded-full transition-all duration-300'
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className='flex justify-between text-sm text-gray-600'>
            <span>Target Date: {formatDate(goal.targetDate)}</span>
            <span>{goal.daysRemaining > 0 ? `${goal.daysRemaining} days left` : 'Overdue'}</span>
          </div>
        </div>

        {/* Update Progress */}
        <div className='mb-6'>
          <h4 className='text-lg font-medium text-white mb-3 flex items-center gap-2'>
            <LuTrendingUp className='w-5 h-5' />
            Update Progress
          </h4>

          <div className='flex gap-3'>
            <div className="input-group flex-1">
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Enter amount to add'
                className='input-control'
                min='0'
                step='100'
              />
            </div>
           
            <button
              onClick={handleUpdateProgress}
              disabled={!amount || parseFloat(amount) <= 0}
              className='add-btn add-btn-fill h-11 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <LuPlus className='w-4 h-4' />
              Add
            </button>
          </div>
        </div>

       

        {/* AI Insights */}
        <div className='mb-6'>
          <button
            onClick={handleGetInsights}
            disabled={loadingInsights}
            className='w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {loadingInsights ? (
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
            ) : (
              <LuBrain className='w-5 h-5' />
            )}
            Get AI Insights
          </button>

          {showInsights && insights && (
            <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <h4 className='text-sm font-medium text-blue-900 mb-3'>AI Insights</h4>
              <div className='space-y-3 text-sm text-blue-800'>
                <div>
                  <strong>On Track:</strong> {insights.onTrack ? 'Yes' : 'No'}
                  <p className='mt-1'>{insights.trackingStatus}</p>
                </div>

                {insights.suggestions && insights.suggestions.length > 0 && (
                  <div>
                    <strong>Suggestions:</strong>
                    <ul className='list-disc list-inside mt-2 space-y-1'>
                      {insights.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.riskAlert && (
                  <div>
                    <strong>Risk Alert:</strong>
                    <p className='mt-1'>{insights.riskAlert}</p>
                  </div>
                )}

                {insights.estimatedCompletion && (
                  <div>
                    <strong>Estimated Completion:</strong>
                    <p className='mt-1'>{formatDate(insights.estimatedCompletion)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


      </div>
    </Modal>
  )
}

export default GoalProgress
