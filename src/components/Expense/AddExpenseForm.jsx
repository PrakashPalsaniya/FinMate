import React from 'react'
import TransactionForm from '../Transactions/TransactionForm'

const AddExpenseForm = ({ onSubmit, onAddExpense, initialData, submitLabel }) => {
    return (
        <TransactionForm
            type="expense"
            initialData={initialData}
            onSubmit={onSubmit || onAddExpense}
            submitLabel={submitLabel || (initialData ? "Save changes" : "Add expense")}
        />
    )
}

export default AddExpenseForm
