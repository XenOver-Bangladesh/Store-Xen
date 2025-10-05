# 🏪 POS Store Management System

A modern, full-featured Point of Sale (POS) Store Management System built with React, featuring inventory management, supplier tracking, and product cataloging with QR code generation.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8)
![Axios](https://img.shields.io/badge/Axios-1.12.2-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 📦 Product Management
- **Add Products**: Comprehensive form with image upload, QR code generation, and category management
- **View Products**: Table and card view toggle for flexible data visualization
- **Edit Products**: Full editing capability with image replacement and QR code regeneration
- **Delete Products**: Confirmation dialogs for safe deletion
- **Advanced Filtering**: Search by name, brand, QR code; filter by category and supplier
- **Export to CSV**: Download filtered product data
- **Duplicate Prevention**: QR code validation to prevent duplicates

### 👥 Supplier Management
- Add, edit, view, and delete suppliers
- Track contact information, payment terms, and status
- Filter and search suppliers
- Export supplier data

### 🎨 User Interface
- **Dual View Modes**: Toggle between table and card layouts
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Modern UI**: Gradient buttons, smooth animations, hover effects
- **Dark/Light Elements**: Professional color schemes
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Helpful messages when no data available

### 🔧 Technical Features
- **QR Code Generation**: Auto-generated unique product identifiers
- **Image Upload**: ImgBB integration for cloud image storage
- **Form Validation**: Client-side validation with error messages
- **Modal System**: Reusable modal components
- **Shared Components**: DRY principle with reusable UI elements
- **State Management**: React hooks (useState, useEffect, useCallback)
- **API Integration**: RESTful API communication with Axios

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- ImgBB API key (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-store-management-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_IMGBB_API_KEY=your_imgbb_api_key_here
   ```

   Get your ImgBB API key from [https://api.imgbb.com/](https://api.imgbb.com/)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
pos-store-management-client/
├── src/
│   ├── Components/
│   │   ├── Footer/
│   │   │   └── Footer.jsx
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   └── UI/
│   │       └── Button.jsx              # Reusable button with multiple variants
│   │
│   ├── Pages/
│   │   ├── HomePage/
│   │   │   └── HomePage.jsx
│   │   ├── ProductPages/
│   │   │   ├── ProductAdd.jsx          # Add new products
│   │   │   ├── ProductManage.jsx       # View/manage all products
│   │   │   ├── AddCategoryModal.jsx    # Add product categories
│   │   │   ├── ViewProductModal.jsx    # View product details
│   │   │   └── EditProductModal.jsx    # Edit product information
│   │   └── SuppliersPages/
│   │       ├── SupplierPages.jsx       # Main supplier management
│   │       ├── SuppliersList.jsx
│   │       ├── SuppliersFilter.jsx
│   │       ├── AddSuppliersModal.jsx
│   │       ├── AddSuppliersFrom.jsx
│   │       ├── EditSuppliersModal.jsx
│   │       └── EditSuppliersForm.jsx
│   │
│   ├── Shared/
│   │   ├── InputFrom/
│   │   │   └── InputFrom.jsx           # Reusable form component
│   │   ├── ReuseableFilter/
│   │   │   └── ReuseableFilter.jsx     # Filter component
│   │   ├── SharedModal/
│   │   │   └── SharedModal.jsx         # Modal wrapper
│   │   └── SharedTable/
│   │       └── SharedTable.jsx         # Table component with sorting/pagination
│   │
│   ├── Layouts/
│   │   └── DashboardLayout.jsx         # Main dashboard layout
│   │
│   ├── Routes/
│   │   └── PublicRoute.jsx             # Route configuration
│   │
│   ├── constants/
│   │   └── zIndex.js                   # Z-index constants
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── .env                                 # Environment variables
├── .gitignore
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **React Router DOM 7.9.3** - Client-side routing
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Vite 7.1.7** - Build tool and dev server

### UI Components & Libraries
- **React Hook Form 7.63.0** - Form state management
- **React Modal 3.16.3** - Accessible modal dialogs
- **TanStack React Table 8.21.3** - Powerful table component
- **Lucide React 0.544.0** - Icon library
- **SweetAlert2 11.23.0** - Beautiful alert/notification system

### HTTP & API
- **Axios 1.12.2** - Promise-based HTTP client

### Backend API
- **Base URL**: `https://pos-system-management-server-20.vercel.app/`

## 📡 API Endpoints

### Products
- `GET /Products` - Fetch all products
- `POST /Products` - Create new product
- `PUT /Products/:id` - Update product
- `DELETE /Products/:id` - Delete product

### Suppliers
- `GET /suppliers` - Fetch all suppliers
- `POST /suppliers` - Create new supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### External APIs
- **ImgBB**: `https://api.imgbb.com/1/upload` - Image hosting
- **QR Server**: `https://api.qrserver.com/v1/create-qr-code/` - QR code generation

## 🎨 Component Documentation

### Button Component
Versatile button component with multiple variants:
- `primary` - Blue gradient
- `secondary` - Gray gradient
- `outline` - Bordered button
- `ghost` - Transparent background
- `edit` - Green gradient
- `delete` - Red gradient
- `glass` - Frosted glass effect
- `neon` - Cyberpunk style

**Sizes**: `sm`, `md`, `lg`

```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### SharedTable Component
Feature-rich table with sorting, filtering, and pagination:
- Sortable columns
- Global search
- Custom row actions
- Loading states
- Empty states
- Pagination (customizable page size)

### SharedModal Component
Accessible modal dialogs with:
- Multiple sizes (small, medium, large, full)
- Custom headers and footers
- Click outside to close
- ESC key support
- Animations

### ReuseableFilter Component
Advanced filtering with:
- Search inputs
- Dropdown filters
- Clear filters
- Export functionality
- Results count display
- Applied filters badges

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_IMGBB_API_KEY` | ImgBB API key for image uploads | Yes |

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint
```

## 🎯 Key Features Breakdown

### Product Add Page
- **Auto-generated QR Codes**: Unique product identifiers
- **Image Upload**: Drag & drop with preview
- **Category Management**: Add categories on-the-fly
- **Supplier Integration**: Select from existing suppliers
- **Validation**: Required field checking
- **Duplicate Prevention**: QR code uniqueness validation

### Product Manage Page
- **View Toggle**: Switch between table and card views
- **Advanced Search**: Multi-field search capability
- **Filtering**: Category and supplier filters
- **CRUD Operations**: View, Edit, Delete with modals
- **Bulk Actions**: Export filtered data to CSV
- **Responsive Cards**: Beautiful product cards with images

### Supplier Management
- **Complete CRUD**: Add, view, edit, delete suppliers
- **Contact Tracking**: Phone, email, address
- **Payment Terms**: Configurable payment options
- **Status Management**: Active/Inactive suppliers
- **Advanced Filtering**: Search and filter suppliers

## 🎨 UI/UX Features

### Design Principles
- **Consistency**: Unified design language across all pages
- **Responsiveness**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Optimized renders, lazy loading
- **Feedback**: Loading states, success/error messages

### Visual Elements
- Gradient buttons with hover effects
- Smooth transitions and animations
- Shadow and depth for layering
- Color-coded actions (view=blue, edit=green, delete=red)
- Professional color palette

## 🐛 Troubleshooting

### Common Issues

**1. Images not uploading**
- Ensure `VITE_IMGBB_API_KEY` is set in `.env`
- Check image file size (max 5MB)
- Verify image format (PNG, JPG, WEBP)

**2. API connection errors**
- Verify backend server is running
- Check CORS configuration
- Confirm API endpoint URLs

**3. Build errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Build project: `npm run build`
2. Deploy `dist` folder
3. Configure environment variables
4. Set build command: `npm run build`

## 📊 Performance Optimization

- **Code Splitting**: Lazy loading routes
- **Image Optimization**: Compressed uploads
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search inputs debounced
- **Pagination**: Large datasets paginated

## 🔄 State Management

The application uses React's built-in state management:
- `useState` - Component local state
- `useEffect` - Side effects and data fetching
- `useCallback` - Memoized callbacks
- Props drilling for shallow component trees
- Context API ready for future scaling

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [TanStack Table Documentation](https://tanstack.com/table/latest)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Store-Xen Team** - *Initial work*

## 🙏 Acknowledgments

- ImgBB for free image hosting
- QR Server for QR code generation
- Tailwind CSS for beautiful styling
- React community for amazing tools

## 📞 Support

For support, email support@storexen.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Dashboard with analytics
- [ ] Sales management
- [ ] Customer management
- [ ] Invoice generation
- [ ] Inventory tracking
- [ ] Multi-user support
- [ ] Role-based access control
- [ ] Barcode scanning
- [ ] Receipt printing
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Multi-language support

---

**Made with ❤️ by Store-Xen Team**

