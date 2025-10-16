import React, { useState, useContext } from 'react';
import { FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { API_ENDPOINTS } from '../api/apiPath';
import { UserContext } from '../context/UserContext';

const ProfilePhotoSelector = () => {
  const [uploading, setUploading] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    setUploading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.UPLOAD_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        updateUser({ ...user, profilePhoto: response.data.data.profilePhoto });
        toast.success('Profile photo updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
        {user?.profilePhoto ? (
          <img 
            src={`http://localhost:5000${user.profilePhoto}`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          user?.name?.charAt(0).toUpperCase()
        )}
      </div>
      
      <label 
        htmlFor="profile-photo" 
        className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition"
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        ) : (
          <FiCamera className="text-gray-600" />
        )}
      </label>
      
      <input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};

export default ProfilePhotoSelector;
