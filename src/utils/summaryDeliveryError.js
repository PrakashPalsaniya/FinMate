export const sanitizeSummaryDeliveryError = (channel, rawMessage) => {
  const normalizedChannel = String(channel || '').trim().toLowerCase()
  const message = String(rawMessage || '').trim()

  if (!message) {
    return ''
  }

  if (normalizedChannel === 'email') {
    if (/BREVO_SENDER_EMAIL|sender/i.test(message)) {
      return 'Email summary is unavailable right now. Please try again later.'
    }

    if (/401|unauthorized/i.test(message)) {
      return 'Email summary is unavailable right now. Please try again later.'
    }

    if (/timeout|socket hang up|Network Error|ECONN/i.test(message)) {
      return 'Email summary could not be delivered right now. Please try again later.'
    }

    return 'Email summary failed. Please try again later.'
  }

  if (normalizedChannel === 'telegram') {
    if (/401|404|unauthorized/i.test(message)) {
      return 'Telegram summary is unavailable right now. Please try again later.'
    }

    if (/message is too long/i.test(message)) {
      return 'Telegram summary could not be delivered right now. Please try again later.'
    }

    if (/timeout|socket hang up|Network Error|ECONN/i.test(message)) {
      return 'Telegram summary could not be delivered right now. Please try again later.'
    }

    return 'Telegram summary failed. Please try again later.'
  }

  return 'Delivery failed. Please try again later.'
}
