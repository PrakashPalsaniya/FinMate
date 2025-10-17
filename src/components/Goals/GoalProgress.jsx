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
      <div className='p-3 sm:p-4 md:p-6 max-h-[80vh] md:max-h-[85vh] overflow-y-auto'>
        {/* Goal Overview */}
        <div className='bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6'>
          <div className='flex items-start gap-2 md:gap-3 mb-3'>
            <LuTarget className='w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-0.5' />
            <h3 className='text-base md:text-lg font-semibold text-gray-900 break-words'>{goal.title}</h3>
          </div>

          <div className='grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4'>
            <div>
              <p className='text-xs md:text-sm text-gray-600 mb-1'>Current Progress</p>
              <p className='text-base md:text-xl font-bold text-gray-900 break-all'>
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>
            <div>
              <p className='text-xs md:text-sm text-gray-600 mb-1'>Target Amount</p>
              <p className='text-base md:text-xl font-bold text-gray-900 break-all'>
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mb-2 md:mb-3'>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-xs md:text-sm font-medium text-gray-700'>Progress</span>
              <span className='text-xs md:text-sm text-gray-600'>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 md:h-3'>
              <div
                className='bg-primary h-2 md:h-3 rounded-full transition-all duration-300'
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm text-gray-600 gap-1'>
            <span>Target Date: {formatDate(goal.targetDate)}</span>
            <span className={goal.daysRemaining < 0 ? 'text-red-600 font-medium' : ''}>
              {goal.daysRemaining > 0 ? `${goal.daysRemaining} days left` : 'Overdue'}
            </span>
          </div>
        </div>

        {/* Update Progress */}
        <div className='mb-4 md:mb-6'>
          <h4 className='text-base md:text-lg font-medium text-white mb-2 md:mb-3 flex items-center gap-2'>
            <LuTrendingUp className='w-4 h-4 md:w-5 md:h-5' />
            <span>Update Progress</span>
          </h4>

          <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
            <div className="input-group flex-1">
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Enter amount to add'
                className='input-control text-sm md:text-base w-full'
                min='0'
                step='100'
              />
            </div>
           
            <button
              onClick={handleUpdateProgress}
              disabled={!amount || parseFloat(amount) <= 0}
              className='add-btn add-btn-fill h-10 md:h-11 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-4 text-sm md:text-base'
            >
              <LuPlus className='w-4 h-4' />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <div className='mb-4 md:mb-6'>
          <button
            onClick={handleGetInsights}
            disabled={loadingInsights}
            className='w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm md:text-base'
          >
            {loadingInsights ? (
              <div className='animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white'></div>
            ) : (
              <LuBrain className='w-4 h-4 md:w-5 md:h-5' />
            )}
            <span>{showInsights && insights ? 'Toggle' : 'Get'} AI Insights</span>
          </button>

          {showInsights && insights && (
            <div className='mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <h4 className='text-sm md:text-base font-medium text-blue-900 mb-2 md:mb-3'>AI Insights</h4>
              <div className='space-y-2 md:space-y-3 text-xs md:text-sm text-blue-800'>
                <div>
                  <strong className='block mb-1'>On Track:</strong>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                    insights.onTrack ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {insights.onTrack ? 'Yes' : 'No'}
                  </span>
                  <p className='mt-1.5 md:mt-2'>{insights.trackingStatus}</p>
                </div>

                {insights.suggestions && insights.suggestions.length > 0 && (
                  <div>
                    <strong className='block mb-1.5'>Suggestions:</strong>
                    <ul className='list-disc list-inside space-y-1 md:space-y-1.5 pl-1'>
                      {insights.suggestions.map((suggestion, index) => (
                        <li key={index} className='leading-relaxed'>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.riskAlert && (
                  <div>
                    <strong className='block mb-1'>Risk Alert:</strong>
                    <div className='bg-yellow-50 border border-yellow-200 p-2 rounded mt-1'>
                      <p className='text-yellow-800'>{insights.riskAlert}</p>
                    </div>
                  </div>
                )}

                {insights.estimatedCompletion && (
                  <div>
                    <strong className='block mb-1'>Estimated Completion:</strong>
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
