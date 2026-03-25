import React, { useState } from 'react'

const Input = ({ value, onChange, label, placeholder, type = "text", ...props }) => {
    const [showPassword, setShowPassword] = useState(false)

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type

    return (
        <div className='input-group'>
            {label && <label className='input-label'>{label}</label>}

            <div className='input-box'>
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className='input-control'
                    {...props}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className='shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:text-primary'
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input
