import React, { useEffect, useState } from 'react'
import { LuBrain, LuTrendingUp, LuTrendingDown, LuTarget, LuShield, LuClock, LuSparkles, LuLightbulb, LuRocket } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATH } from '../../utils/apiPath.js'
import { useUserAuth } from '../../hooks/useUserAuth.jsx'
import { addIndianThousandSeparator } from '../../utils/helper.js'

const AISummary = () => {
  useUserAuth()

  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAISummary = async () => {
    setSummaryData(null)
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(API_PATH.AI_SUMMARY.GET_SUMMARY)

      if (response.data && response.data.success) {
        setSummaryData(response.data)
      } else {
        setError("Failed to fetch AI summary")
      }
    } catch (error) {
      console.log("Error fetching AI summary:", error)
      setError(error.response?.data?.message || "Something went wrong. Please try again")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAISummary()
  }, [])

  const financialData = summaryData?.data
  const aiSummary = summaryData?.aiSummary
  const isCached = summaryData?.cached

  return (
    <DashboardLayout activeMenu="AI Summary">
      <div className='my-5 mx-auto'>
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-in {
            animation: slideIn 0.5s ease-out both;
          }
        `}</style>

        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <LuBrain className='text-3xl text-primary' />
            <h1 className='text-2xl font-bold text-gray-800'>AI Financial Summary</h1>
          </div>
          
          {summaryData && !loading && (
            <div className='flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm border'>
              <LuClock className={isCached ? 'text-green-500' : 'text-blue-500'} />
              <span className={isCached ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                {isCached ? 'Cached (Instant)' : 'Freshly Generated'}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4'></div>
            <span className='text-xl text-gray-700 font-semibold'>Analyzing your finances...</span>
            <span className='text-sm text-gray-500 mt-2'>Generating personalized insights</span>
          </div>
        )}

        {error && !loading && (
          <div className='bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-sm'>
            <div className='flex items-center gap-3 mb-3'>
              <span className='text-3xl'>⚠️</span>
              <p className='text-red-700 font-semibold text-lg'>Oops! Something went wrong</p>
            </div>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={fetchAISummary}
              className='px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 font-medium shadow-md'
            >
              Try Again
            </button>
          </div>
        )}

        {summaryData && !loading && !error && (
          <>
            {/* Conversational Summary Hero */}
            {aiSummary?.insightsSummary && (
              <div className='bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl shadow-md border-2 border-blue-100 mb-6 animate-slide-in'>
                <div className='flex items-start gap-4'>
                  <div className='text-4xl'>💡</div>
                  <div className='flex-1'>
                    <h2 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-2'>
                      <LuSparkles className='text-purple-500' />
                      {aiSummary.summaryTitle || "Your Financial Snapshot"}
                    </h2>
                    <p className='text-gray-700 leading-relaxed text-base'>
                      {aiSummary.insightsSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Overview Cards with Progress */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
              <div className='bg-white p-5 rounded-xl shadow-md border-2 border-green-100 hover:shadow-lg transition-shadow'>
                <div className='flex items-center gap-2 mb-3'>
                  <LuTrendingUp className='text-green-500 text-xl' />
                  <span className='text-sm font-semibold text-gray-600'>Total Income</span>
                </div>
                <p className='text-2xl font-bold text-green-600 mb-2'>
                  ₹{addIndianThousandSeparator(financialData?.totalIncome || 0)}
                </p>
                {financialData?.trends?.incomeChange !== null && (
                  <div className='flex items-center gap-1 text-xs'>
                    <span className={financialData.trends.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {financialData.trends.incomeChange >= 0 ? '↑' : '↓'} {Math.abs(financialData.trends.incomeChange)}%
                    </span>
                    <span className='text-gray-500'>vs last month</span>
                  </div>
                )}
              </div>

              <div className='bg-white p-5 rounded-xl shadow-md border-2 border-red-100 hover:shadow-lg transition-shadow'>
                <div className='flex items-center gap-2 mb-3'>
                  <LuTrendingDown className='text-red-500 text-xl' />
                  <span className='text-sm font-semibold text-gray-600'>Total Expenses</span>
                </div>
                <p className='text-2xl font-bold text-red-600 mb-2'>
                  ₹{addIndianThousandSeparator(financialData?.totalExpenses || 0)}
                </p>
                {financialData?.trends?.expenseChange !== null && (
                  <div className='flex items-center gap-1 text-xs'>
                    <span className={financialData.trends.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}>
                      {financialData.trends.expenseChange >= 0 ? '↑' : '↓'} {Math.abs(financialData.trends.expenseChange)}%
                    </span>
                    <span className='text-gray-500'>vs last month</span>
                  </div>
                )}
              </div>

              <div className='bg-white p-5 rounded-xl shadow-md border-2 border-blue-100 hover:shadow-lg transition-shadow'>
                <div className='flex items-center gap-2 mb-3'>
                  <LuTarget className='text-blue-500 text-xl' />
                  <span className='text-sm font-semibold text-gray-600'>Current Balance</span>
                </div>
                <p className={`text-2xl font-bold mb-2 ${financialData?.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₹{addIndianThousandSeparator(financialData?.totalBalance || 0)}
                </p>
                <p className='text-xs text-gray-500'>
                  ₹{addIndianThousandSeparator(financialData?.spendingVelocity?.dailyAverage || 0)}/day average
                </p>
              </div>

              <div className='bg-white p-5 rounded-xl shadow-md border-2 border-purple-100 hover:shadow-lg transition-shadow'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <LuShield className='text-purple-500 text-xl' />
                    <span className='text-sm font-semibold text-gray-600'>Savings Rate</span>
                  </div>
                  <span className='text-2xl font-bold text-purple-600'>
                    {financialData?.savingsRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-3 mb-2'>
                  <div 
                    className='bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out'
                    style={{ width: `${Math.min(financialData?.savingsRate || 0, 100)}%` }}
                  ></div>
                </div>
                <p className='text-xs text-gray-500 text-center font-medium'>
                  {financialData?.savingsRate >= 50 ? '🔥 Outstanding!' : 
                   financialData?.savingsRate >= 20 ? '✨ Good Progress' : 
                   '💪 Keep Improving'}
                </p>
              </div>
            </div>

            {/* AI Insights */}
            {aiSummary && (
              <div className='grid grid-cols-1 gap-6'>
                <div className='bg-white p-6 rounded-2xl shadow-md border'>
                  
                  {/* Key Highlights */}
                  {aiSummary.highlights && aiSummary.highlights.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <LuSparkles className='text-yellow-500' />
                        Key Insights
                      </h3>
                      <div className='space-y-3'>
                        {aiSummary.highlights.map((highlight, index) => (
                          <div 
                            key={index} 
                            className='text-sm text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-slide-in'
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Score */}
                  {aiSummary.aiScore && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <LuTarget className='text-blue-500' />
                        Your Financial Health Score
                      </h3>
                      <div className='flex flex-wrap gap-3'>
                        <div className='flex-1 min-w-[150px] bg-gradient-to-br from-green-100 to-green-50 p-5 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='text-3xl'>💚</span>
                            <p className='text-xs font-semibold text-green-700 uppercase tracking-wide'>Health</p>
                          </div>
                          <p className='text-xl font-bold text-green-800'>
                            {aiSummary.aiScore.financialHealth}
                          </p>
                        </div>
                        
                        <div className='flex-1 min-w-[150px] bg-gradient-to-br from-blue-100 to-blue-50 p-5 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='text-3xl'>⚡</span>
                            <p className='text-xs font-semibold text-blue-700 uppercase tracking-wide'>Savings</p>
                          </div>
                          <p className='text-xl font-bold text-blue-800'>
                            {aiSummary.aiScore.savingsEfficiency}
                          </p>
                        </div>
                        
                        <div className='flex-1 min-w-[150px] bg-gradient-to-br from-orange-100 to-orange-50 p-5 rounded-xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='text-3xl'>🛡️</span>
                            <p className='text-xs font-semibold text-orange-700 uppercase tracking-wide'>Risk</p>
                          </div>
                          <p className='text-xl font-bold text-orange-800'>
                            {aiSummary.aiScore.riskLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Smart Moves */}
                  {aiSummary.smartMoves && aiSummary.smartMoves.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <LuLightbulb className='text-yellow-500' />
                        Smart Moves
                      </h3>
                      <div className='space-y-3'>
                        {aiSummary.smartMoves.map((move, index) => (
                          <div 
                            key={index} 
                            className='bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-100 flex items-start justify-between gap-3 hover:shadow-md transition-shadow'
                          >
                            <div className='flex-1'>
                              <p className='text-sm text-gray-800 leading-relaxed'>{move}</p>
                            </div>
                            <button className='px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 whitespace-nowrap shadow-sm'>
                              Take Action
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  {aiSummary.nextSteps && aiSummary.nextSteps.length > 0 && (
                    <div>
                      <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <LuRocket className='text-purple-500' />
                        Your Action Plan
                      </h3>
                      <div className='space-y-3'>
                        {aiSummary.nextSteps.map((step, index) => (
                          <div 
                            key={index} 
                            className='text-sm text-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-100 hover:shadow-md transition-shadow'
                          >
                            <span className='font-semibold text-purple-600'>Step {index + 1}:</span> {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <div className='mt-8 text-center'>
              <button
                onClick={fetchAISummary}
                disabled={loading}
                className='px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:from-primary/90 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 mx-auto shadow-lg font-semibold text-lg'
              >
                <LuBrain className='text-2xl' />
                {loading ? 'Generating...' : 'Refresh AI Summary'}
              </button>
              <p className='text-xs text-gray-500 mt-3'>
                AI insights are cached to save time. Refresh to generate new analysis.
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AISummary
