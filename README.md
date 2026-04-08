# VanWallet - Digital Wallet Application

A modern, responsive e-wallet application built with React, Vite, and Tailwind CSS. VanWallet provides a seamless digital payment experience with an intuitive user interface and comprehensive wallet functionality.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design built with Tailwind CSS
- **User Authentication**: Secure sign-in and registration system
- **Dashboard**: Comprehensive wallet overview with charts and analytics
- **Transaction Management**: Send, receive, and track transactions
- **Multi-platform**: Available on iOS and Android (Google Play Store & App Store)
- **Real-time Updates**: Live transaction status and balance updates
- **Charts & Analytics**: Visual representation of spending patterns using Chart.js

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Styling**: Tailwind CSS 4.2.2
- **Routing**: React Router 7.14.0
- **Forms**: React Hook Form with Joi validation
- **Icons**: Font Awesome & Lucide React
- **Charts**: Chart.js with react-chartjs-2
- **Modals**: React Responsive Modal
- **Linting**: ESLint with React-specific rules

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/rivando-al-rasyid/vanwallet-react.git
cd vanwallet-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks

## 📱 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Hero.jsx       # Landing page hero section
│   ├── Features.jsx   # Feature showcase
│   ├── About.jsx      # About section
│   └── ...           # Other components
├── layouts/           # Layout components
│   ├── Navbar.jsx     # Navigation bar
│   └── Footer.jsx     # Footer component
├── pages/            # Page components
├── utils/            # Utility functions
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

## 🌟 Key Features

### Landing Page
- Eye-catching hero section with app download CTAs
- Feature highlights and benefits
- User testimonials and partner logos
- Responsive design for all devices

### Authentication
- Secure user registration and login
- Form validation with Joi schemas
- Smooth user experience with React Hook Form

### Dashboard
- Real-time balance display
- Transaction history with filters
- Spending analytics with interactive charts
- Quick action buttons for common tasks

## 🔧 Development

### Environment Variables
Create a `.env` file in the root directory with your environment variables.

### Code Quality
The project uses ESLint with React-specific rules to maintain code quality and consistency.

### Build Optimization
The application is optimized for production with Vite's build system, providing fast load times and efficient bundle sizes.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

As this is a private project, contributions are managed internally.

---

**Built with ❤️ using React, Vite, and modern web technologies**
