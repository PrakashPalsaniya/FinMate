import React, { useEffect, useState } from 'react'
import Input from '../inputs/Input'
import {
    TRANSACTION_CATEGORIES,
    createTransactionFormState,
} from '../../utils/transactionConfig'

const FORM_COPY = {
    income: {
        titlePlaceholder: "Income title",
        amountPlaceholder: "2000",
        submitLabel: "Add income",
    },
    expense: {
        titlePlaceholder: "Expense title",
        amountPlaceholder: "1200",
        submitLabel: "Add expense",
    },
}

const TransactionForm = ({ type, initialData, onSubmit, submitLabel }) => {
    const [transaction, setTransaction] = useState(() =>
        createTransactionFormState(initialData)
    )

    useEffect(() => {
        setTransaction(createTransactionFormState(initialData))
    }, [initialData])

    const formCopy = FORM_COPY[type] || FORM_COPY.expense
    const categories = TRANSACTION_CATEGORIES[type] || []

    const handleChange = (key, value) => {
        setTransaction((current) => ({ ...current, [key]: value }))
    }

    return (
        <div>
            <Input
                value={transaction.title}
                onChange={({ target }) => handleChange("title", target.value)}
                label="Title"
                placeholder={formCopy.titlePlaceholder}
                type="text"
            />

            <div className="input-group">
                <label className="input-label">Category</label>
                <div className='input-box'>
                    <select
                        value={transaction.category}
                        onChange={({ target }) => handleChange("category", target.value)}
                        className="input-control"
                    >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Input
                value={transaction.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder={formCopy.amountPlaceholder}
                type="number"
            />

            <Input
                value={transaction.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                type="date"
            />

            <div className="mt-6 flex justify-stretch sm:justify-end">
                <button
                    type='button'
                    className='btn-primary !rounded-full !px-5 sm:!w-auto'
                    onClick={() => onSubmit(transaction)}
                >
                    {submitLabel || formCopy.submitLabel}
                </button>
            </div>
        </div>
    )
}

export default TransactionForm
