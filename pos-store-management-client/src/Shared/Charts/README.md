# 📊 Reusable Chart Components

Beautiful, responsive chart components built with **Recharts** for the Store-Xen POS system.

---

## 📦 Available Charts

1. **LineChart** - Display trends over time
2. **BarChart** - Compare values across categories
3. **PieChart** - Show distribution and proportions
4. **AreaChart** - Visualize cumulative data

---

## 🚀 Installation

Recharts is already installed in the project:

```bash
npm install recharts
```

---

## 📖 Usage Examples

### 1. Line Chart

Perfect for showing trends over time (sales, revenue, users, etc.)

```jsx
import { LineChart } from '../../Shared/Charts'

const MySalesChart = () => {
  const data = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 }
  ]

  return (
    <LineChart
      data={data}
      lines={[
        { dataKey: 'sales', stroke: '#3b82f6', name: 'Sales' },
        { dataKey: 'revenue', stroke: '#10b981', name: 'Revenue' }
      ]}
      xAxisKey="name"
      height={300}
      showGrid={true}
      showLegend={true}
    />
  )
}
```

**Props:**
- `data` (Array) - Array of data objects
- `lines` (Array) - Array of line configurations `[{dataKey, stroke, name}]`
- `xAxisKey` (String) - Key for X-axis data (default: 'name')
- `height` (Number) - Chart height in pixels (default: 300)
- `showGrid` (Boolean) - Show grid lines (default: true)
- `showLegend` (Boolean) - Show legend (default: true)
- `strokeWidth` (Number) - Line thickness (default: 2)
- `dot` (Boolean) - Show dots on data points (default: true)

---

### 2. Bar Chart

Great for comparing values across different categories

```jsx
import { BarChart } from '../../Shared/Charts'

const MyProductChart = () => {
  const data = [
    { name: 'Product A', sales: 4000, profit: 2400 },
    { name: 'Product B', sales: 3000, profit: 1398 },
    { name: 'Product C', sales: 2000, profit: 9800 },
    { name: 'Product D', sales: 2780, profit: 3908 }
  ]

  return (
    <BarChart
      data={data}
      bars={[
        { dataKey: 'sales', fill: '#3b82f6', name: 'Sales' },
        { dataKey: 'profit', fill: '#10b981', name: 'Profit' }
      ]}
      xAxisKey="name"
      height={300}
      showGrid={true}
      showLegend={true}
    />
  )
}
```

**Props:**
- `data` (Array) - Array of data objects
- `bars` (Array) - Array of bar configurations `[{dataKey, fill, name}]`
- `xAxisKey` (String) - Key for X-axis data (default: 'name')
- `height` (Number) - Chart height in pixels (default: 300)
- `showGrid` (Boolean) - Show grid lines (default: true)
- `showLegend` (Boolean) - Show legend (default: true)
- `layout` (String) - 'horizontal' or 'vertical' (default: 'horizontal')

---

### 3. Pie Chart

Ideal for showing proportions and distribution

```jsx
import { PieChart } from '../../Shared/Charts'

const MyCategoryChart = () => {
  const data = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 200 },
    { name: 'Books', value: 100 }
  ]

  return (
    <PieChart
      data={data}
      colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
      height={300}
      showLegend={true}
      dataKey="value"
      nameKey="name"
    />
  )
}
```

**Props:**
- `data` (Array) - Array of data objects `[{name, value}]`
- `colors` (Array) - Array of color hex codes (default: 8 colors)
- `height` (Number) - Chart height in pixels (default: 300)
- `showLegend` (Boolean) - Show legend (default: true)
- `dataKey` (String) - Key for data values (default: 'value')
- `nameKey` (String) - Key for names (default: 'name')
- `innerRadius` (Number) - Inner radius for donut chart (default: 0)
- `outerRadius` (Number) - Outer radius (default: 80)

**Donut Chart Example:**
```jsx
<PieChart
  data={data}
  innerRadius={60}
  outerRadius={80}
  // ... other props
/>
```

---

### 4. Area Chart

Perfect for showing cumulative trends

```jsx
import { AreaChart } from '../../Shared/Charts'

const MyRevenueChart = () => {
  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 }
  ]

  return (
    <AreaChart
      data={data}
      areas={[
        { dataKey: 'revenue', stroke: '#10b981', name: 'Revenue' },
        { dataKey: 'expenses', stroke: '#ef4444', name: 'Expenses' }
      ]}
      xAxisKey="name"
      height={300}
      showGrid={true}
      showLegend={true}
    />
  )
}
```

**Props:**
- `data` (Array) - Array of data objects
- `areas` (Array) - Array of area configurations `[{dataKey, stroke, fill, name}]`
- `xAxisKey` (String) - Key for X-axis data (default: 'name')
- `height` (Number) - Chart height in pixels (default: 300)
- `showGrid` (Boolean) - Show grid lines (default: true)
- `showLegend` (Boolean) - Show legend (default: true)
- `stackId` (String) - ID for stacking areas (optional)

---

## 🎨 Color Palette

Recommended colors from Tailwind CSS:

```javascript
const colors = {
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6',
  orange2: '#f97316'
}
```

---

## 💡 Advanced Features

### Custom Tooltips

All charts include beautiful custom tooltips with:
- White background with shadow
- Color indicators
- Formatted values with commas
- Responsive design

### Responsive Design

All charts are fully responsive using `ResponsiveContainer` from Recharts.

### Empty States

Charts automatically show "No data available" message when data is empty.

---

## 🔧 Common Patterns

### Dynamic Data Loading

```jsx
const MyChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData().then(result => {
      setData(result)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <LineChart
      data={data}
      lines={[{ dataKey: 'value', stroke: '#3b82f6', name: 'Sales' }]}
    />
  )
}
```

### Conditional Rendering

```jsx
<div className="chart-container">
  {data.length > 0 ? (
    <PieChart data={data} />
  ) : (
    <div className="text-center text-slate-400">
      No data to display
    </div>
  )}
</div>
```

### Multiple Charts

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold mb-4">Sales Trend</h3>
    <LineChart data={salesData} lines={[...]} />
  </div>
  
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold mb-4">Category Distribution</h3>
    <PieChart data={categoryData} />
  </div>
</div>
```

---

## 📊 Real-World Examples

### Dashboard Sales Chart

```jsx
import { AreaChart } from '../../../Shared/Charts'

const SalesTrendChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.date,
    sales: item.salesCount,
    revenue: item.revenueAmount
  }))

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
      <AreaChart
        data={chartData}
        areas={[
          { dataKey: 'sales', stroke: '#6366f1', name: 'Sales Count' },
          { dataKey: 'revenue', stroke: '#10b981', name: 'Revenue (BDT)' }
        ]}
        height={300}
      />
    </div>
  )
}
```

### Inventory Distribution

```jsx
import { PieChart } from '../../../Shared/Charts'

const StockDistribution = ({ inventory }) => {
  // Group by category
  const categoryData = inventory.reduce((acc, item) => {
    const category = item.category || 'Other'
    acc[category] = (acc[category] || 0) + item.quantity
    return acc
  }, {})

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }))

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Stock by Category</h2>
      <PieChart
        data={chartData}
        height={300}
        innerRadius={60}
        outerRadius={90}
      />
    </div>
  )
}
```

---

## 🎯 Best Practices

1. **Data Formatting**: Ensure data is in the correct format before passing to charts
2. **Loading States**: Show loading indicators while fetching data
3. **Empty States**: Handle empty data gracefully
4. **Responsive**: Test charts on different screen sizes
5. **Colors**: Use consistent colors across your app
6. **Accessibility**: Provide meaningful labels and legends
7. **Performance**: Use `useMemo` for expensive data transformations

---

## 🐛 Troubleshooting

### Chart not displaying

- Check if data array is not empty
- Verify data structure matches chart requirements
- Ensure dataKey matches your data object keys

### Tooltip not showing

- Make sure data has values
- Check browser console for errors

### Colors not working

- Use hex color codes: `#3b82f6`
- Ensure colors array has enough colors for your data

---

## 📚 Resources

- [Recharts Documentation](https://recharts.org/)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)

---

**Made with ❤️ for Store-Xen POS System**

