import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Total Income',
      amount: summary?.totalIncome || 0,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Expense',
      amount: summary?.totalExpense || 0,
      icon: FiTrendingDown,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Balance',
      amount: summary?.balance || 0,
      icon: FiDollarSign,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-2">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {formatAmount(card.amount)}
              </p>
            </div>
            <div className={`${card.bgColor} p-4 rounded-full`}>
              <card.icon className={`${card.textColor} w-8 h-8`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
