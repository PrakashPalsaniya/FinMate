import React, { useState } from 'react'
import { LuTarget, LuCalendar, LuTrendingUp, LuEdit, LuTrash2, LuPlus, LuCheckCircle, LuClock, LuBrain } from 'react-icons/lu'
import toast from 'react-hot-toast'

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress, onGetInsights }) => {
  const [showInsights, setShowInsights] = useState(false)
  const [insights, setInsights] = useState(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  const progressPercentage = goal.progressPercentage || 0
  const isCompleted = goal.status === 'completed'

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
      toast.error('Failed to get insights')
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
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>{goal.title}</h3>
          <p className='text-sm text-gray-600 line-clamp-2'>{goal.description}</p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={onEdit}
            className='p-1 text-gray-400 hover:text-gray-600 transition-colors'
          >
            <LuEdit className='w-4 h-4' />
          </button>
          <button
            onClick={onDelete}
            className='p-1 text-gray-400 hover:text-red-600 transition-colors'
          >
            <LuTrash2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className='flex flex-wrap gap-2 mb-4'>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}>
          {goal.priority}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
          {goal.status}
        </span>
        <span className='px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800'>
          {goal.goalType.replace('_', ' ')}
        </span>
      </div>

      {/* Progress */}
      <div className='mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-medium text-gray-700'>Progress</span>
          <span className='text-sm text-gray-600'>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-primary h-2 rounded-full transition-all duration-300'
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className='flex justify-between text-sm text-gray-600 mt-1'>
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>

      {/* Dates */}
      <div className='flex justify-between text-sm text-gray-600 mb-4'>
        <div className='flex items-center gap-1'>
          <LuCalendar className='w-4 h-4' />
          <span>Target: {formatDate(goal.targetDate)}</span>
        </div>
        <div className='flex items-center gap-1'>
          <LuClock className='w-4 h-4' />
          <span>{goal.daysRemaining > 0 ? `${goal.daysRemaining} days left` : 'Overdue'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className='flex gap-2'>
        <button
          onClick={() => onUpdateProgress(goal._id, goal.currentAmount + 1000)}
          className='flex-1 flex items-center justify-center gap-2 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'
        >
          <LuPlus className='w-4 h-4' />
          Add Progress
        </button>
        <button
          onClick={handleGetInsights}
          disabled={loadingInsights}
          className='flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50'
        >
          {loadingInsights ? (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700'></div>
          ) : (
            <LuBrain className='w-4 h-4' />
          )}
          AI Insights
        </button>
      </div>

      {/* AI Insights */}
      {showInsights && insights && (
        <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
          <h4 className='text-sm font-medium text-blue-900 mb-2'>AI Insights</h4>
          <div className='space-y-2 text-sm text-blue-800'>
            <p><strong>On Track:</strong> {insights.onTrack ? 'Yes' : 'No'} - {insights.trackingStatus}</p>
            {insights.suggestions && insights.suggestions.length > 0 && (
              <div>
                <strong>Suggestions:</strong>
                <ul className='list-disc list-inside mt-1'>
                  {insights.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {insights.riskAlert && (
              <p><strong>Risk:</strong> {insights.riskAlert}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalCard
