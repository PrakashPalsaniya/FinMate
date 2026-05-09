import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { API_ENDPOINTS } from '../../api/apiPath';

const DownloadExpenseBtn = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.EXPENSE_EXPORT, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expense-report-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Expense report downloaded successfully!');
    } catch {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiDownload />
      <span>{loading ? 'Downloading...' : 'Download Excel'}</span>
    </button>
  );
};

export default DownloadExpenseBtn;
