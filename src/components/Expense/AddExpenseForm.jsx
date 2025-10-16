import React, { useState } from 'react'
import Input from '../inputs/Input'

const AddExpenseForm = ({ onAddExpense }) => {

    const expenseCategories = [
        "rent",
        "entertainment",
        "food",
        "transport",
        "utilities",
        "healthcare",
        "education",
        "shopping",
        "others"
    ];

    const [income, setIncome] = useState({
        title: "",
        category: "",
        amount: "",
        date: "",
    })

    const handleChange = (key, value) => setIncome({ ...income, [key]: value })


    return (
        <div>
            <Input
                value={income.title}
                onChange={({ target }) => handleChange("title", target.value)}
                label="Title"
                placeholder="Expense title"
                type="text"
            />

            <div className="input-group">
                <label className="input-label">Category</label>
                <select
                    value={income.category}
                    onChange={({ target }) => handleChange("category", target.value)}
                    className="input-control"
                >
                    <option value="">Select Category</option>
                    {expenseCategories.map((category) => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="1200"
                type="number"
            />
            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type='button'
                    className='add-btn add-btn-fill'
                    onClick={() => onAddExpense(income)}
                >
                    Add Expense
                </button>
            </div>
        </div>
    )
}

export default AddExpenseForm