# ServiceMatch Customer App

A modern React.js application for booking professional services, similar to Uber but for service providers like plumbers, electricians, house cleaners, and more.

## Features

### 🔐 Authentication
- **Sign Up & Login Pages**: Secure user registration and authentication
- Form validation and error handling
- Password visibility toggle
- Responsive design

### 👥 Professional Profiles
- **Comprehensive Professional Cards** showing:
  - Name and profession
  - Years of experience
  - Star ratings and review counts
  - Distance from your location
  - Availability status
  - Professional avatar
  - Skills and specializations

### 💰 Pricing System
- **Normal Service**: ₹499 (Standard quality service)
- **Premium Service**: ₹599 (Enhanced service with extras)
- Transparent pricing with platform fees

### 🔍 Advanced Filtering
- **Experience Level**: 0-2, 3-5, 6-10, 10+ years
- **Price Range**: Normal, Premium, or Both
- **Rating Filter**: 4.0+, 4.5+, 4.8+ stars
- **Distance**: Within 1km, 2km, or 5km
- **Availability**: Available now, Available today
- Real-time search by name, profession, or skills

### 📅 Booking System (Uber-like Experience)
- **Service Selection**: Choose between Normal and Premium service
- **Date & Time Booking**: Select from available slots
- **Service Details**: Add address, contact info, and special instructions
- **Payment Summary**: Clear breakdown of costs
- **Booking Confirmation**: Success page with details
- **Booking Progress**: Loading states and real-time updates

### 📋 Booking History & Rating System
- **View All Bookings**: Complete history with status tracking
- **Filter Options**: All, Completed, Upcoming, Cancelled bookings
- **Service Rating**: Rate completed services with 1-5 stars
- **Review System**: Write detailed reviews for professionals
- **Booking Stats**: Track total services and spending
- **Service Management**: Reschedule or cancel upcoming bookings

### 💬 Real-time Chat
- **Live Chat with Professionals**: Communicate before and during service
- **Message History**: View previous conversations
- **Typing Indicators**: See when professionals are typing
- **Voice & Video Call Options**: Additional communication methods
- **Professional Status**: See online/offline status
- **Mobile Responsive**: Chat works seamlessly on all devices

### 📱 Responsive Design
- **Mobile-First**: Optimized for smartphones and tablets
- **Desktop Compatible**: Full functionality on larger screens
- **Touch-Friendly**: Easy navigation on touch devices
- **Modern UI**: Clean, intuitive interface

## Professional Categories

- 🔧 **Plumbing**: Pipe repairs, installations, emergency services
- ⚡ **Electrical**: Wiring, repairs, safety inspections  
- 🔨 **Carpentry**: Custom furniture, repairs, installations

## Tech Stack

- **Frontend**: React.js 18
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS3 with modern features
- **State Management**: React Hooks
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aksh56511/sServiceMatch-customer.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

### For Customers

1. **Sign Up/Login**: Create an account or sign in
2. **Browse Professionals**: View available service providers
3. **Apply Filters**: Use filters to find the perfect professional
4. **Chat**: Communicate with professionals before booking
5. **Book Service**: Select service type, date, time, and location
6. **Track Progress**: Monitor your booking status
7. **Rate & Review**: Share your experience after service completion

### Key User Flows

1. **Finding a Professional**:
   - Login → Home → Find Professionals → Apply Filters → View Profiles

2. **Booking a Service**:
   - Select Professional → Book Now → Choose Service Type → Select Date/Time → Enter Details → Confirm Payment

3. **Communication**:
   - Browse Professionals → Click Chat → Start Conversation → Schedule Service

## Project Structure

```
src/
├── components/
│   ├── Auth.css           # Shared authentication styles
│   ├── BookingPage.css    # Booking interface styles
│   ├── BookingPage.js     # Service booking component
│   ├── ChatBox.css        # Chat interface styles
│   ├── ChatBox.js         # Real-time chat component
│   ├── FilterPanel.css    # Filter interface styles
│   ├── FilterPanel.js     # Professional filtering component
│   ├── Home.css           # Homepage styles
│   ├── Home.js            # Landing page component
│   ├── Login.js           # User login form
│   ├── Navbar.css         # Navigation styles
│   ├── Navbar.js          # Top navigation component
│   ├── ProfessionalCard.css # Professional profile styles
│   ├── ProfessionalCard.js  # Individual professional component
│   ├── ProfessionalList.css # Professional list styles
│   ├── ProfessionalList.js  # Professional listing component
│   └── SignUp.js          # User registration form
├── App.css                # Main app styles
├── App.js                 # Main app component
├── index.css              # Global styles
└── index.js               # App entry point
```

## Features in Detail

### Professional Profiles Include:
- **Professional Information**: Name, profession, experience level
- **Performance Metrics**: Star rating, number of reviews
- **Location Data**: Distance from customer location
- **Availability**: Real-time availability status
- **Service Options**: Normal vs Premium pricing
- **Skills**: List of specializations and expertise areas
- **Communication**: Direct chat integration

### Booking System Features:
- **Service Type Selection**: Normal (₹499) vs Premium (₹599)
- **Flexible Scheduling**: Date and time selection
- **Location Services**: Service address input
- **Special Instructions**: Custom requirements
- **Payment Integration**: Transparent pricing breakdown
- **Confirmation System**: Booking success confirmation

### Chat System Features:
- **Real-time Messaging**: Instant communication
- **Rich Media**: Support for attachments and emojis
- **Professional Status**: Online/offline indicators
- **Message History**: Persistent conversation logs
- **Mobile Optimization**: Responsive chat interface

## Mock Data

The application includes realistic mock data for demonstration:
- 6 professional profiles across different service categories
- Sample chat conversations
- Various experience levels and ratings
- Different availability statuses
- Realistic pricing structures

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Future Enhancements

- [ ] Real-time location tracking
- [ ] Push notifications
- [ ] Payment gateway integration
- [ ] Review and rating system
- [ ] Service history
- [ ] Favorite professionals
- [ ] Advanced search filters
- [ ] Multi-language support
- [ ] Dark mode theme
