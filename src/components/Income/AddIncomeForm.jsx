import React from 'react'
import TransactionForm from '../Transactions/TransactionForm'

const AddIncomeForm = ({ onSubmit, onAddIncome, initialData, submitLabel }) => {
    return (
        <TransactionForm
            type="income"
            initialData={initialData}
            onSubmit={onSubmit || onAddIncome}
            submitLabel={submitLabel || (initialData ? "Save changes" : "Add income")}
        />
    )
}

export default AddIncomeForm
