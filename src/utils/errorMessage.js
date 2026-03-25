const TECHNICAL_MESSAGE_PATTERNS = [
  /ECONNRESET/i,
  /ECONNABORTED/i,
  /ERR_NETWORK/i,
  /ERR_/i,
  /Network Error/i,
  /Request failed with status code/i,
  /socket hang up/i,
  /Failed to fetch/i,
  /Load failed/i,
  /timeout/i,
]

const isTechnicalMessage = (value = '') =>
  TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(String(value || '').trim()))

export const getUserFriendlyErrorMessage = (
  error,
  {
    fallback = 'Something went wrong. Please try again later.',
    networkMessage = 'Unable to reach the server right now. Please try again shortly.',
    unauthorizedMessage = 'Your session expired. Please sign in again.',
    allowUnauthorizedMessage = false,
  } = {}
) => {
  const status = Number(error?.response?.status || 0)
  const responseMessage = String(error?.response?.data?.message || '').trim()
  const rawMessage = String(error?.message || '').trim()

  if (responseMessage && !isTechnicalMessage(responseMessage)) {
    if (status === 401 && !allowUnauthorizedMessage) {
      return unauthorizedMessage
    }

    return responseMessage
  }

  if (status === 401) {
    return unauthorizedMessage
  }

  if (status === 403) {
    return 'You do not have permission to do that.'
  }

  if (!error?.response) {
    return networkMessage
  }

  if (isTechnicalMessage(rawMessage)) {
    return status >= 500 ? fallback : networkMessage
  }

  if (status >= 500) {
    return fallback
  }

  return fallback
}
