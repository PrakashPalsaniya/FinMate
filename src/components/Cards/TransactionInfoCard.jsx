import React from 'react'
import { LuTrash2, LuTrendingDown, LuTrendingUp, LuUtensils, LuWalletMinimal, LuLaptop, LuBuilding, LuTrendingUp as LuInvestment, LuHouse, LuGamepad2, LuCar, LuZap, LuHeart, LuGraduationCap, LuShoppingBag } from 'react-icons/lu'
import { getIncomeIcon, getIconComponent, getExpenseIcon } from '../../utils/helper'


const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) => {


    const getAmountStyles = () => type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";


    const renderIcon = () => {
        if (icon && typeof icon === 'string') {
            if (type === 'income') {
                const IconComponent = getIncomeIcon(icon);
                return <IconComponent />;
            } else if (type === 'expense') {
                const IconComponent = getExpenseIcon(icon);
                return <IconComponent />;
            }
        }
        return <LuUtensils />;
    };


    return <div className='group relative flex items-center gap-3 mt-2 p-3 rounded-lg hover:bg-gray-100/50'>
        <div className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl text-gray-800 bg-gray-100 rounded-full shrink-0'>
            {renderIcon()}
        </div>


        <div className='flex-1 flex items-center justify-between gap-2 min-w-0'>
            <div className='min-w-0 flex-1'>
                <p className='text-xs sm:text-sm text-gray-700 font-medium truncate'>{title}</p>
                <p className='text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1'>{date}</p>
            </div>


            <div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
                {!hideDeleteBtn && (
                    <button
                        className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1.5 sm:p-2 active:bg-gray-100 rounded'
                        onClick={onDelete}
                        aria-label="Delete transaction"
                    >
                        <LuTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>)
                }
                <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap ${getAmountStyles()}`}>
                    <h6 className='text-[10px] sm:text-xs font-medium'>
                        {type === "income" ? "+" : "-"} ₹{amount}
                    </h6>
                    <LuTrendingUp className={`shrink-0 w-3 h-3 sm:w-4 sm:h-4 ${type === "expense" ? "hidden" : ""}`} />
                    <LuTrendingDown className={`shrink-0 w-3 h-3 sm:w-4 sm:h-4 ${type === "income" ? "hidden" : ""}`} />
                </div>
            </div>
        </div>
    </div>
}


export default TransactionInfoCard
