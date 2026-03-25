import React from 'react'
import { getInitials } from '../../utils/helper'

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div className={`${width || 'w-12'} ${height || 'h-12'} flex items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary shadow-[0_16px_36px_-28px_rgba(15,118,110,0.55)] ${style || ''}`}>
      {getInitials(fullName || "")}
    </div>
  )
}

export default CharAvatar
