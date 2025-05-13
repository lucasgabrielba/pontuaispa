import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

// Dados de exemplo para gastos mensais
const data = [
  {
    name: 'Jan',
    total: 1890,
  },
  {
    name: 'Fev',
    total: 2350,
  },
  {
    name: 'Mar',
    total: 3100,
  },
  {
    name: 'Abr',
    total: 2700,
  },
  {
    name: 'Mai',
    total: 3250,
  },
  {
    name: 'Jun',
    total: 3521,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}