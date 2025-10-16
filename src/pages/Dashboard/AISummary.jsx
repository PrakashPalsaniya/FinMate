import React, { useEffect, useState } from 'react'
import { LuBrain, LuTrendingUp, LuTrendingDown, LuTarget, LuShield, LuClock } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATH } from '../../utils/apiPath.js'
import { useUserAuth } from '../../hooks/useUserAuth.jsx'
import { addIndianThousandSeparator } from '../../utils/helper.js'

const AISummary = () => {
  useUserAuth()

  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true) // Start as true for initial load
  const [error, setError] = useState(null)

  const fetchAISummary = async () => {
    // Clear old data and start loading
    setSummaryData(null)
    setLoading(true) // Always set to true when fetching
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
      setLoading(false) // Turn off loading after data is set
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
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <LuBrain className='text-2xl text-primary' />
            <h1 className='text-2xl font-bold text-gray-800'>AI Financial Summary</h1>
          </div>
          
          {/* Cache indicator */}
          {summaryData && !loading && (
            <div className='flex items-center gap-2 text-sm'>
              <LuClock className={isCached ? 'text-green-500' : 'text-blue-500'} />
              <span className={isCached ? 'text-green-600' : 'text-blue-600'}>
                {isCached ? 'Cached (Instant)' : 'Freshly Generated'}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
            <span className='text-lg text-gray-600 font-medium'>Generating AI insights...</span>
            <span className='text-sm text-gray-500 mt-2'>This may take a few seconds</span>
          </div>
        )}

        {error && !loading && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-600'>{error}</p>
            <button
              onClick={fetchAISummary}
              className='mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
            >
              Try Again
            </button>
          </div>
        )}

        {summaryData && !loading && !error && (
          <>
            {/* Financial Overview Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
              <div className='bg-white p-4 rounded-lg shadow-sm border'>
                <div className='flex items-center gap-2 mb-2'>
                  <LuTrendingUp className='text-green-500' />
                  <span className='text-sm font-medium text-gray-600'>Total Income</span>
                </div>
                <p className='text-xl font-bold text-green-600'>
                  ₹{addIndianThousandSeparator(financialData?.totalIncome || 0)}
                </p>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border'>
                <div className='flex items-center gap-2 mb-2'>
                  <LuTrendingDown className='text-red-500' />
                  <span className='text-sm font-medium text-gray-600'>Total Expenses</span>
                </div>
                <p className='text-xl font-bold text-red-600'>
                  ₹{addIndianThousandSeparator(financialData?.totalExpenses || 0)}
                </p>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border'>
                <div className='flex items-center gap-2 mb-2'>
                  <LuTarget className='text-blue-500' />
                  <span className='text-sm font-medium text-gray-600'>Current Balance</span>
                </div>
                <p className={`text-xl font-bold ${financialData?.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₹{addIndianThousandSeparator(financialData?.totalBalance || 0)}
                </p>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border'>
                <div className='flex items-center gap-2 mb-2'>
                  <LuShield className='text-purple-500' />
                  <span className='text-sm font-medium text-gray-600'>Savings Rate</span>
                </div>
                <p className='text-xl font-bold text-purple-600'>
                  {financialData?.savingsRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>

            {/* AI Insights */}
            {aiSummary && (
              <div className='grid grid-cols-1 gap-6'>
                <div className='bg-white p-6 rounded-lg shadow-sm border'>
                  <div className='flex items-center gap-2 mb-6'>
                    <LuBrain className='text-primary text-xl' />
                    <h2 className='text-xl font-bold text-gray-800'>
                      {aiSummary.summaryTitle || "AI Financial Summary"}
                    </h2>
                  </div>

                  {aiSummary.highlights && aiSummary.highlights.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-semibold text-gray-700 mb-3'>Key Highlights</h3>
                      <div className='space-y-2'>
                        {aiSummary.highlights.map((highlight, index) => (
                          <p key={index} className='text-sm text-gray-700 bg-blue-50 p-3 rounded-lg'>
                            {highlight}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiSummary.aiScore && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-semibold text-gray-700 mb-3'>AI Financial Score</h3>
                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                        <div className='text-center p-3 bg-green-50 rounded-lg'>
                          <p className='text-xs font-medium text-green-800 mb-1'>Financial Health</p>
                          <p className='text-lg font-bold text-green-600'>
                            {aiSummary.aiScore.financialHealth || "N/A"}
                          </p>
                        </div>
                        <div className='text-center p-3 bg-blue-50 rounded-lg'>
                          <p className='text-xs font-medium text-blue-800 mb-1'>Savings Efficiency</p>
                          <p className='text-lg font-bold text-blue-600'>
                            {aiSummary.aiScore.savingsEfficiency || "N/A"}
                          </p>
                        </div>
                        <div className='text-center p-3 bg-orange-50 rounded-lg'>
                          <p className='text-xs font-medium text-orange-800 mb-1'>Risk Level</p>
                          <p className='text-lg font-bold text-orange-600'>
                            {aiSummary.aiScore.riskLevel || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {aiSummary.smartMoves && aiSummary.smartMoves.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-lg font-semibold text-gray-700 mb-3'>Smart Moves</h3>
                      <div className='space-y-2'>
                        {aiSummary.smartMoves.map((move, index) => (
                          <p key={index} className='text-sm text-gray-700 bg-green-50 p-3 rounded-lg'>
                            {move}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiSummary.nextSteps && aiSummary.nextSteps.length > 0 && (
                    <div>
                      <h3 className='text-lg font-semibold text-gray-700 mb-3'>Next Steps</h3>
                      <div className='space-y-2'>
                        {aiSummary.nextSteps.map((step, index) => (
                          <p key={index} className='text-sm text-gray-700 bg-purple-50 p-3 rounded-lg'>
                            {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className='mt-6 text-center'>
              <button
                onClick={fetchAISummary}
                disabled={loading}
                className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto'
              >
                <LuBrain />
                {loading ? 'Generating...' : 'Refresh AI Summary'}
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AISummary
