import React, { useRef, useState } from 'react'
import { LuUpload, LuTrash, LuUser } from "react-icons/lu"

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleImageChanges = (event) => {
        const file = event.target.files[0]

        if (file) {
            setImage(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleRemoveImage = () => {
        setImage(null)
        setPreviewUrl(null)
    }

    return (
        <div className='mb-6 rounded-[28px] border border-dashed border-primary/25 bg-primary/6 p-4'>
            <input
                className='hidden'
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChanges}
            />

            <div className='flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-start sm:text-left'>
                {!image ? (
                    <div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-white text-primary shadow-[0_20px_40px_-28px_rgba(15,118,110,0.55)]'>
                        <LuUser className='text-4xl' />
                    </div>
                ) : (
                    <img className='h-20 w-20 shrink-0 rounded-[24px] object-cover shadow-[0_20px_40px_-28px_rgba(15,23,42,0.45)]' src={previewUrl} alt="Profile preview" />
                )}

                <div className='min-w-0 flex-1'>
                    <h4 className='text-sm font-semibold text-slate-900'>Add a profile photo</h4>
                    <p className='mt-1 text-sm leading-6 text-slate-500'>
                        A photo makes the workspace feel more personal, but you can skip it for now if you want.
                    </p>
                </div>

                <div className='flex gap-2'>
                    <button
                        className='btn-secondary !w-auto !rounded-full !px-4 !py-2.5'
                        type='button'
                        onClick={() => inputRef.current?.click()}
                    >
                        <LuUpload className='text-base' />
                        {image ? "Replace" : "Upload"}
                    </button>

                    {image && (
                        <button
                            className='btn-secondary !w-auto !rounded-full !border-red-100 !bg-red-50 !px-4 !py-2.5 !text-red-600 hover:!border-red-200'
                            type='button'
                            onClick={handleRemoveImage}
                        >
                            <LuTrash className='text-base' />
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePhotoSelector
