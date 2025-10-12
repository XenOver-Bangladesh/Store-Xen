# 🚀 Quick Start Guide - Charts

## Import Charts

```jsx
import { LineChart, BarChart, PieChart, AreaChart } from '../../Shared/Charts'
```

---

## 1️⃣ Line Chart (Trends)

```jsx
const data = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 }
]

<LineChart
  data={data}
  lines={[
    { dataKey: 'sales', stroke: '#3b82f6', name: 'Sales' }
  ]}
  xAxisKey="month"
  height={300}
/>
```

---

## 2️⃣ Bar Chart (Comparisons)

```jsx
const data = [
  { product: 'Product A', quantity: 120 },
  { product: 'Product B', quantity: 80 },
  { product: 'Product C', quantity: 150 }
]

<BarChart
  data={data}
  bars={[
    { dataKey: 'quantity', fill: '#10b981', name: 'Quantity' }
  ]}
  xAxisKey="product"
  height={300}
/>
```

---

## 3️⃣ Pie Chart (Distribution)

```jsx
const data = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 200 }
]

<PieChart
  data={data}
  height={300}
/>
```

---

## 4️⃣ Area Chart (Cumulative)

```jsx
const data = [
  { day: 'Mon', revenue: 4000 },
  { day: 'Tue', revenue: 3000 },
  { day: 'Wed', revenue: 5000 }
]

<AreaChart
  data={data}
  areas={[
    { dataKey: 'revenue', stroke: '#10b981', name: 'Revenue' }
  ]}
  xAxisKey="day"
  height={300}
/>
```

---

## 🎨 Common Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | `[]` | Data array |
| `height` | Number | `300` | Chart height in pixels |
| `showGrid` | Boolean | `true` | Show grid lines |
| `showLegend` | Boolean | `true` | Show legend |
| `xAxisKey` | String | `'name'` | X-axis data key |

---

## 🌈 Color Examples

```jsx
// Single color
stroke: '#3b82f6'

// Multiple colors
colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}

// Named colors from Tailwind
Blue:   #3b82f6
Green:  #10b981
Orange: #f59e0b
Red:    #ef4444
Purple: #8b5cf6
Pink:   #ec4899
Teal:   #14b8a6
```

---

## 💡 Tips

1. **Data Format:** Ensure data is an array of objects
2. **Keys:** Make sure dataKey matches your object keys
3. **Height:** Adjust height based on container
4. **Colors:** Use hex codes for colors
5. **Empty Data:** Charts handle empty data gracefully

---

## 📝 Complete Example

```jsx
import React from 'react'
import { LineChart } from '../../Shared/Charts'

const MyPage = () => {
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 24000 },
    { month: 'Feb', sales: 3000, revenue: 18000 },
    { month: 'Mar', sales: 5000, revenue: 30000 },
    { month: 'Apr', sales: 4500, revenue: 27000 }
  ]

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
        
        <LineChart
          data={salesData}
          lines={[
            { dataKey: 'sales', stroke: '#3b82f6', name: 'Sales Count' },
            { dataKey: 'revenue', stroke: '#10b981', name: 'Revenue (BDT)' }
          ]}
          xAxisKey="month"
          height={350}
          showGrid={true}
          showLegend={true}
        />
      </div>
    </div>
  )
}

export default MyPage
```

---

## 🎯 See It in Action

Check the Dashboard Overview page to see charts working with real data!

**Dashboard → Overview**

---

Need more help? Check **README.md** in this folder! 📚

