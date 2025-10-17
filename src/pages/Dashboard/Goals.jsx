import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import { LuPlus, LuTarget, LuBrain, LuClock, LuRefreshCw, LuSparkles } from 'react-icons/lu'
import toast from 'react-hot-toast'
import AddGoalForm from '../../components/Goals/AddGoalForm'
import GoalProgress from '../../components/Goals/GoalProgress'

const Goals = () => {
  useUserAuth()

  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [isCached, setIsCached] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchGoals(),
      fetchGoalsSummary()
    ])
    setLoading(false)
  }

  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.GOALS.GET_ALL_GOALS)
      if (response.data.success) {
        setGoals(response.data.goals || [])
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to fetch goals')
      setGoals([])
    }
  }

  const fetchGoalsSummary = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.GOALS.GET_GOALS_SUMMARY)
      if (response.data.success) {
        setSummary(response.data.summary)
      }
    } catch (error) {
      console.error('Error fetching goals summary:', error)
    }
  }

  const fetchGoalsAIInsights = async () => {
    try {
      setInsightsLoading(true)
      const response = await axiosInstance.get(API_PATH.GOALS.GET_GOALS_AI_INSIGHTS)
      
      if (response.data.success && response.data.insights) {
        setAiInsights(response.data)
        setIsCached(response.data.cached || false)
        setShowInsights(true)
        
        if (response.data.cached) {
          toast.success('Loaded cached insights (instant!)', { icon: '⚡' })
        } else {
          toast.success('Fresh AI insights generated!', { icon: '✨' })
        }
      }
    } catch (error) {
      console.error('Error fetching goals AI insights:', error)
      toast.error('Failed to fetch AI insights')
    } finally {
      setInsightsLoading(false)
    }
  }

  const handleGenerateInsights = () => {
    fetchGoalsAIInsights()
  }

  const handleRefreshInsights = async () => {
    toast.loading('Generating fresh insights...', { id: 'refresh-insights' })
    await fetchGoalsAIInsights()
    toast.success('AI insights refreshed!', { id: 'refresh-insights' })
  }

  const handleAddGoal = async (goalData) => {
    try {
      const response = await axiosInstance.post(API_PATH.GOALS.CREATE_GOAL, goalData)
      if (response.data.success) {
        toast.success('Goal created successfully')
        setShowAddForm(false)
        await fetchGoals()
        await fetchGoalsSummary()
        setShowInsights(false)
        setAiInsights(null)
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      toast.error(error.response?.data?.message || 'Failed to create goal')
    }
  }

  const handleUpdateGoal = async (goalId, updateData) => {
    try {
      const response = await axiosInstance.put(API_PATH.GOALS.UPDATE_GOAL(goalId), updateData)
      if (response.data.success) {
        toast.success('Goal updated successfully')
        await fetchGoals()
        await fetchGoalsSummary()
        setShowInsights(false)
        setAiInsights(null)
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to update goal')
    }
  }

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await axiosInstance.delete(API_PATH.GOALS.DELETE_GOAL(goalId))
      if (response.data.success) {
        toast.success('Goal deleted successfully')
        await fetchGoals()
        await fetchGoalsSummary()
        setShowInsights(false)
        setAiInsights(null)
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to delete goal')
    }
  }

  const handleUpdateProgress = async (goalId, amount) => {
    try {
      const response = await axiosInstance.patch(API_PATH.GOALS.UPDATE_GOAL_PROGRESS(goalId), { amount })
      if (response.data.success) {
        toast.success('Progress updated successfully')
        await fetchGoals()
        await fetchGoalsSummary()
        setShowInsights(false)
        setAiInsights(null)
        setSelectedGoal(null)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    }
  }

  const handleGetInsights = async (goalId) => {
    try {
      const response = await axiosInstance.get(API_PATH.GOALS.GET_GOAL_INSIGHTS(goalId))
      if (response.data.success) {
        return response.data.insights
      }
    } catch (error) {
      console.error('Error getting insights:', error)
      toast.error('Failed to get insights')
      return null
    }
  }

  return (
    <DashboardLayout activeMenu="Goals">
      <div className='px-3 sm:px-4 md:px-6 py-3 md:py-4'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6'>
          <div className='flex items-center gap-2 md:gap-3'>
            <LuTarget className='text-xl md:text-2xl text-primary' />
            <h1 className='text-xl md:text-2xl font-bold text-gray-800'>Financial Goals</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className='flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 md:py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm md:text-base w-full sm:w-auto'
          >
            <LuPlus className='text-lg' />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className='flex flex-col items-center justify-center py-12 md:py-20'>
            <div className='animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mb-3 md:mb-4'></div>
            <span className='text-sm md:text-base text-gray-600'>Loading your goals...</span>
          </div>
        ) : (
          <>
            {/* Generate AI Insights Button */}
            {goals.length > 0 && !showInsights && (
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-blue-200'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4'>
                  <div className='flex items-start sm:items-center gap-2 md:gap-3'>
                    <div className='w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <LuBrain className='text-lg md:text-2xl text-blue-600' />
                    </div>
                    <div>
                      <h3 className='text-base md:text-lg font-bold text-gray-800'>Get AI-Powered Insights</h3>
                      <p className='text-xs md:text-sm text-gray-600'>
                        Analyze your goals progress and get personalized recommendations
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateInsights}
                    disabled={insightsLoading}
                    className='flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm md:text-base w-full sm:w-auto whitespace-nowrap'
                  >
                    {insightsLoading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white'></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <LuSparkles className='text-base md:text-lg' />
                        <span>Generate AI Insights</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* AI Insights Section */}
            {showInsights && aiInsights?.insights && goals.length > 0 && (
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 md:mb-4'>
                  <div className='flex items-center gap-2 md:gap-3'>
                    <LuBrain className='text-xl md:text-2xl text-blue-600' />
                    <h2 className='text-lg md:text-xl font-bold text-gray-800'>AI Goals Insights</h2>
                    {isCached && (
                      <span className='flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                        <LuClock className='text-xs' />
                        <span className='hidden sm:inline'>Cached (Instant)</span>
                        <span className='sm:hidden'>Cached</span>
                      </span>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={handleRefreshInsights}
                      disabled={insightsLoading}
                      className='flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors px-2 md:px-3 py-1 rounded-lg hover:bg-white'
                    >
                      <LuRefreshCw className={`text-sm ${insightsLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={() => setShowInsights(false)}
                      className='text-xs md:text-sm text-gray-500 hover:text-gray-700 px-2 md:px-3 py-1 rounded-lg hover:bg-white'
                    >
                      Hide
                    </button>
                  </div>
                </div>

                <div className='bg-white rounded-lg p-3 md:p-4 shadow-sm'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4'>
                    {aiInsights.insights.summaryTitle}
                  </h3>
                  
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
                    {/* Key Highlights */}
                    <div>
                      <h4 className='font-medium text-sm md:text-base text-gray-700 mb-2 flex items-center gap-2'>
                        <span className='text-blue-500'>💡</span>
                        <span>Key Highlights</span>
                      </h4>
                      <ul className='text-xs md:text-sm text-gray-600 space-y-1.5 md:space-y-2'>
                        {aiInsights.insights.highlights?.map((highlight, index) => (
                          <li key={index} className='flex items-start gap-2 bg-blue-50 p-2 rounded'>
                            <span className='text-blue-500 mt-0.5 flex-shrink-0'>•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Smart Moves */}
                    <div>
                      <h4 className='font-medium text-sm md:text-base text-gray-700 mb-2 flex items-center gap-2'>
                        <span className='text-green-500'>✅</span>
                        <span>Smart Moves</span>
                      </h4>
                      <ul className='text-xs md:text-sm text-gray-600 space-y-1.5 md:space-y-2'>
                        {aiInsights.insights.smartMoves?.map((move, index) => (
                          <li key={index} className='flex items-start gap-2 bg-green-50 p-2 rounded'>
                            <span className='text-green-500 mt-0.5 flex-shrink-0'>•</span>
                            <span>{move}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Score */}
                    <div>
                      <h4 className='font-medium text-sm md:text-base text-gray-700 mb-2 flex items-center gap-2'>
                        <span className='text-purple-500'>⭐</span>
                        <span>AI Score</span>
                      </h4>
                      <div className='space-y-1.5 md:space-y-2'>
                        <div className='flex justify-between items-center text-xs md:text-sm bg-gray-50 p-2 rounded'>
                          <span className='text-gray-600'>Goal Achievement:</span>
                          <span className={`font-medium px-2 py-0.5 md:py-1 rounded text-xs ${
                            aiInsights.insights.aiScore?.goalAchievement === 'Excellent' ? 'bg-green-100 text-green-700' :
                            aiInsights.insights.aiScore?.goalAchievement === 'Good' ? 'bg-blue-100 text-blue-700' :
                            aiInsights.insights.aiScore?.goalAchievement === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {aiInsights.insights.aiScore?.goalAchievement || 'N/A'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-xs md:text-sm bg-gray-50 p-2 rounded'>
                          <span className='text-gray-600'>Progress Efficiency:</span>
                          <span className={`font-medium px-2 py-0.5 md:py-1 rounded text-xs ${
                            aiInsights.insights.aiScore?.progressEfficiency === 'High' ? 'bg-green-100 text-green-700' :
                            aiInsights.insights.aiScore?.progressEfficiency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {aiInsights.insights.aiScore?.progressEfficiency || 'N/A'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-xs md:text-sm bg-gray-50 p-2 rounded'>
                          <span className='text-gray-600'>Risk Level:</span>
                          <span className={`font-medium px-2 py-0.5 md:py-1 rounded text-xs ${
                            aiInsights.insights.aiScore?.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                            aiInsights.insights.aiScore?.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {aiInsights.insights.aiScore?.riskLevel || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className='mt-3 md:mt-4 pt-3 md:pt-4 border-t'>
                    <h4 className='font-medium text-sm md:text-base text-gray-700 mb-2 flex items-center gap-2'>
                      <LuClock className='text-purple-500' />
                      <span>Next Steps</span>
                    </h4>
                    <ul className='text-xs md:text-sm text-gray-600 space-y-1.5 md:space-y-2'>
                      {aiInsights.insights.nextSteps?.map((step, index) => (
                        <li key={index} className='flex items-start gap-2 bg-purple-50 p-2 rounded'>
                          <span className='text-purple-500 mt-0.5 flex-shrink-0'>→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cache Info */}
                  {aiInsights.generatedAt && (
                    <div className='mt-3 md:mt-4 text-xs text-gray-500 text-right'>
                      Generated: {new Date(aiInsights.generatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary Cards */}
            {summary && (
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6'>
                <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
                  <h3 className='text-xs md:text-sm font-medium text-gray-600'>Total Goals</h3>
                  <p className='text-xl md:text-2xl font-bold text-gray-800'>{summary.totalGoals}</p>
                </div>
                <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
                  <h3 className='text-xs md:text-sm font-medium text-gray-600'>High Priority</h3>
                  <p className='text-xl md:text-2xl font-bold text-gray-800'>{summary.highPriority}</p>
                </div>
                <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
                  <h3 className='text-xs md:text-sm font-medium text-gray-600'>Total Target</h3>
                  <p className='text-base md:text-2xl font-bold text-gray-800'>
                    ₹{summary.totalTargetAmount?.toLocaleString() || 0}
                  </p>
                </div>
                <div className='bg-white p-3 md:p-4 rounded-lg shadow-sm border'>
                  <h3 className='text-xs md:text-sm font-medium text-gray-600'>Avg Progress</h3>
                  <p className='text-xl md:text-2xl font-bold text-gray-800'>
                    {summary.averageProgress?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {goals.length === 0 && (
              <div className='bg-white rounded-lg shadow-sm border p-8 md:p-12 text-center'>
                <LuTarget className='text-5xl md:text-6xl text-gray-300 mx-auto mb-3 md:mb-4' />
                <h3 className='text-lg md:text-xl font-semibold text-gray-700 mb-2'>No Goals Yet</h3>
                <p className='text-sm md:text-base text-gray-500 mb-3 md:mb-4'>Create your first financial goal to get started!</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className='inline-flex items-center gap-2 bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base'
                >
                  <LuPlus />
                  <span>Create Your First Goal</span>
                </button>
              </div>
            )}

            {/* Goals Grid */}
            {goals.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
                {goals.map((goal) => (
                  <div 
                    key={goal._id} 
                    className='bg-white rounded-lg shadow-sm border p-3 md:p-4 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-2 md:mb-3'>
                      <div className='flex-1 pr-2'>
                        <h3 className='font-semibold text-sm md:text-base text-gray-800 mb-1 line-clamp-2'>
                          {goal.title || 'Untitled Goal'}
                        </h3>
                        <p className='text-xs text-gray-500 capitalize'>
                          {goal.goalType?.replace('_', ' ') || 'Other'}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 md:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {goal.priority}
                      </span>
                    </div>

                    <div className='mb-2 md:mb-3'>
                      <div className='flex justify-between text-xs md:text-sm mb-1'>
                        <span className='text-gray-600'>Progress</span>
                        <span className='font-medium'>
                          {goal.progressPercentage?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1.5 md:h-2'>
                        <div
                          className='bg-primary h-1.5 md:h-2 rounded-full transition-all duration-300'
                          style={{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm mb-2 md:mb-3'>
                      <div>
                        <p className='text-gray-500'>Current</p>
                        <p className='font-semibold text-sm md:text-base'>
                          ₹{goal.currentAmount?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-500'>Target</p>
                        <p className='font-semibold text-sm md:text-base'>
                          ₹{goal.targetAmount?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 mb-2 md:mb-3 pb-2 md:pb-3 border-b gap-1'>
                      <span className='truncate'>
                        Due: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className={`${goal.daysRemaining < 0 ? 'text-red-600 font-medium' : ''} whitespace-nowrap`}>
                        {goal.daysRemaining >= 0 ? `${goal.daysRemaining} days left` : 'Overdue'}
                      </span>
                    </div>

                    <div className='flex gap-2'>
                      <button
                        onClick={() => setSelectedGoal(goal)}
                        className='flex-1 bg-primary text-white py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm hover:bg-primary/90 transition-colors'
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className='px-2 md:px-3 py-1.5 md:py-2 border border-red-200 text-red-600 rounded-lg text-xs md:text-sm hover:bg-red-50 transition-colors'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add Goal Modal */}
        {showAddForm && (
          <AddGoalForm
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddGoal}
          />
        )}

        {/* Goal Progress Modal */}
        {selectedGoal && (
          <GoalProgress
            goal={selectedGoal}
            onClose={() => setSelectedGoal(null)}
            onUpdateProgress={handleUpdateProgress}
            onGetInsights={handleGetInsights}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default Goals
