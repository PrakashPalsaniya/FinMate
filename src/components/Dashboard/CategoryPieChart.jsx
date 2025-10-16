import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#875cf5", "#22C55E", "#FF6900", "#4f39f6","#29c9f6"];

const CategoryPieChart = ({ data, title }) => {

    const chartData = Object.keys(data || {}).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        amount: data[key],
    }));

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">{title}</h5>
            </div>

            <CustomPieChart
                data={chartData}
                colors={COLORS}
            />
        </div>
    )
}

export default CategoryPieChart
