import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const data = [
  { name: 'Livelo', value: 1567, color: '#ff6b6b' },
  { name: 'Smiles', value: 853, color: '#feca57' },
  { name: 'Esfera', value: 435, color: '#48dbfb' },
  { name: 'Outros', value: 214, color: '#1dd1a1' },
]

export function PointsStatus() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} pontos`, 'Total']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}