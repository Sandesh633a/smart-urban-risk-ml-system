# Frontend - Smart Urban Environmental Risk Prediction Dashboard

A modern, beautiful SaaS-style dashboard for visualizing and managing environmental risk predictions powered by machine learning.

## 🎨 Design Features

- **Modern SaaS Aesthetic**: Clean, premium design inspired by Stripe/Notion dashboards
- **Soft Light Theme**: Muted gray background with white cards and soft shadows
- **Blue Accent Colors**: Primary blue (#3B82F6) for highlights and interactive elements
- **Inter Font**: Professional typography using Google Fonts
- **Responsive Charts**: Interactive data visualizations using Recharts
- **Smooth Animations**: Micro-interactions and transitions for enhanced UX

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Recharts** - Beautiful, responsive charts
- **Axios** - HTTP client for API communication
- **Vanilla CSS** - Custom design system with CSS variables

## 📊 Features

### Dashboard Components

1. **Top Metrics Cards**
   - Tomorrow's PM2.5 prediction
   - Overall risk score
   - Hotspot cluster classification
   - Active monitoring status

2. **Interactive Charts**
   - 7-day pollution trend (Area chart)
   - Risk score & violations trend (Line chart)
   - 24-hour weather conditions (Area chart)
   - Environmental quality index (Bar chart)

3. **Data Input Modal**
   - Comprehensive form for adding environmental data
   - Organized by categories (Location, Air Quality, Weather, etc.)
   - Auto-triggers model retraining after submission

4. **Real-time Updates**
   - Live predictions from ML models
   - System status monitoring
   - Recent alerts display

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🔌 API Integration

The frontend connects to the backend API running on `http://localhost:5000`:

- `GET /predict` - Fetch predictions (PM2.5, risk score, hotspot cluster)
- `POST /add-data` - Submit environmental data and trigger model retraining

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── MetricCard.jsx      # Reusable metric display card
│   │   ├── ChartCard.jsx       # Wrapper for Recharts components
│   │   └── DataInputModal.jsx  # Form modal for data entry
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Design system & global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Orange)
- **Danger**: #EF4444 (Red)
- **Background**: #F5F6F8
- **Card**: #FFFFFF

### Typography
- **Font Family**: Inter
- **Heading**: 24px, weight 600
- **Card Title**: 14px, weight 500
- **Big Numbers**: 36px, weight 700

### Spacing (8px System)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Shadows
- Soft shadows for depth
- Hover effects for interactivity
- No harsh shadows

## 🔧 Configuration

To change the backend API URL, edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000';
```

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop (1400px+ - optimal viewing)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎯 Usage

1. **View Predictions**: Dashboard automatically loads predictions on page load
2. **Refresh Data**: Click "Refresh Predictions" to fetch latest ML predictions
3. **Add New Data**: Click "Add New Data" to open the input modal
4. **Submit Data**: Fill the form and submit to add data and retrain models

## 🌟 Key Features

- **Auto-refresh**: Predictions update after adding new data
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during API calls
- **Notifications**: Success/error notifications for user actions
- **Data Validation**: Form validation before submission

## 💡 Development Tips

- Use the design system classes from `index.css`
- Follow the card pattern for new components
- Keep color palette consistent
- Maintain soft shadows and rounded corners
- Use Inter font for all text

## 🐛 Troubleshooting

**Backend Connection Error**:
- Ensure backend server is running on port 5000
- Check CORS is enabled in backend
- Verify API endpoints are accessible

**Charts Not Rendering**:
- Check Recharts is properly installed
- Verify data format matches expected structure
- Ensure container has proper dimensions

## 📝 License

Part of the Smart Urban Environmental Risk Prediction System
