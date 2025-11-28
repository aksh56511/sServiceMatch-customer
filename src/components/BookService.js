import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  Loader
} from 'lucide-react';
import APIService from '../utils/APIService';
import './BookService.css';

const BookService = ({ user }) => {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [bookingData, setBookingData] = useState({
    service: '',
    description: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'standard',
    customerLocation: { lat: 12.9716, lng: 77.5946 } // Will be updated with real location
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
  const [locationLoaded, setLocationLoaded] = useState(false);

  // Get user's actual location on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationLoaded(true);
        },
        (error) => {
          console.log('Location access denied, using default:', error);
          setLocationLoaded(true); // Still proceed with default
        }
      );
    } else {
      setLocationLoaded(true); // Geolocation not available
    }
  }, []);

  useEffect(() => {
    // Load all professionals on component mount
    const loadAllProfessionals = async () => {
      const allProfs = await APIService.getProfessionals('');
      // Sort by distance from user location
      const sorted = allProfs.sort((a, b) => {
        const distA = calculateDistance(a);
        const distB = calculateDistance(b);
        return distA - distB;
      });
      setProfessionals(sorted);
    };
    
    if (locationLoaded) {
      // Update bookingData with real location
      setBookingData(prev => ({
        ...prev,
        customerLocation: userLocation
      }));
      loadAllProfessionals();
    }
    loadMyBookings();
  }, [locationLoaded, userLocation]);

  const calculateDistance = (professional) => {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Earth's radius in km
    const lat1 = bookingData.customerLocation.lat;
    const lon1 = bookingData.customerLocation.lng;
    const lat2 = professional.location?.lat || 12.9716;
    const lon2 = professional.location?.lng || 77.5946;
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const loadProfessionals = async (profession = '') => {
    // Capitalize profession for API call
    const capitalizedProfession = profession 
      ? profession.charAt(0).toUpperCase() + profession.slice(1)
      : '';
    const availableProfs = await APIService.getProfessionals(capitalizedProfession);
    // Sort by distance from user location
    const sorted = availableProfs.sort((a, b) => {
      const distA = calculateDistance(a);
      const distB = calculateDistance(b);
      return distA - distB;
    });
    setProfessionals(sorted);
  };

  const loadMyBookings = async () => {
    const bookings = await APIService.getCustomerBookings(user.id);
    setMyBookings(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    setSelectedProfessional(null);
    loadProfessionals(profession);
  };

  const handleSelectProfessional = (professional) => {
    setSelectedProfessional(professional);
    setBookingData(prev => ({
      ...prev,
      service: `${professional.profession} Service`
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = async () => {
    if (!selectedProfessional || !bookingData.service || !bookingData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setBookingStatus(null);

    try {
      const booking = await APIService.createBooking({
        customerId: user.id,
        customerName: user.name,
        professionalId: selectedProfessional.id,
        service: bookingData.service,
        date: bookingData.preferredDate,
        time: bookingData.preferredTime,
        description: bookingData.description
      });

      if (booking) {
        setBookingStatus({
          type: 'pending',
          message: `Booking request sent to ${selectedProfessional.name}! Waiting for response...`,
          bookingId: booking.id
        });
        
        // Reset form
        setSelectedProfessional(null);
        setBookingData({
          service: '',
          description: '',
          address: '',
          preferredDate: '',
          preferredTime: '',
          urgency: 'standard',
          customerLocation: { lat: 40.7128, lng: -74.0060 }
        });
        
        loadMyBookings();
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus({
        type: 'error',
        message: 'Failed to send booking request. Please try again.',
        bookingId: null
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'declined': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <CheckCircle size={16} />;
      case 'declined': return <XCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="book-service">
      <h2>Book Professional Services</h2>
      
      {/* Booking Status Alert */}
      {bookingStatus && (
        <div className={`status-alert ${bookingStatus.type}`}>
          <div className="status-content">
            {bookingStatus.type === 'accepted' && <CheckCircle size={20} />}
            {bookingStatus.type === 'declined' && <XCircle size={20} />}
            {bookingStatus.type === 'pending' && <Loader size={20} className="spinner" />}
            <span>{bookingStatus.message}</span>
          </div>
        </div>
      )}

      {/* Profession Selection */}
      <div className="profession-selector">
        <h3>Select Service Type</h3>
        <div className="profession-buttons">
          <button
            className={`profession-btn ${selectedProfession === 'carpenter' ? 'active' : ''}`}
            onClick={() => handleProfessionChange('carpenter')}
          >
            🔨 Carpenter
          </button>
          <button
            className={`profession-btn ${selectedProfession === 'plumber' ? 'active' : ''}`}
            onClick={() => handleProfessionChange('plumber')}
          >
            🔧 Plumber
          </button>
          <button
            className={`profession-btn ${selectedProfession === 'electrician' ? 'active' : ''}`}
            onClick={() => handleProfessionChange('electrician')}
          >
            ⚡ Electrician
          </button>
        </div>
      </div>

      {/* Available Professionals */}
      <div className="professionals-section">
        <h3>{selectedProfession ? `Available ${selectedProfession}s` : 'Available Professionals'}</h3>
        <div className="professionals-grid">
          {professionals.length > 0 ? (
            professionals.map(professional => (
              <div 
                key={professional.id} 
                className={`professional-card ${selectedProfessional?.id === professional.id ? 'selected' : ''}`}
                onClick={() => handleSelectProfessional(professional)}
              >
                <div className="professional-header">
                  <div className="professional-avatar">
                    {professional.profilePicture ? (
                      <img src={professional.profilePicture} alt={professional.name} />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div className="professional-info">
                    <h4>{professional.name}</h4>
                    <p className="profession">{professional.profession}</p>
                    <div className="rating">
                      <Star size={16} fill="#ffc107" />
                      <span>{professional.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="professional-details">
                  <p className="bio">{professional.bio}</p>
                  
                  <div className="professional-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{professional.location?.city || 'New York, NY'} • {calculateDistance(professional).toFixed(1)} km away</span>
                    </div>
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <span>₹{professional.pricing?.hourlyRate}/hr</span>
                    </div>
                    <div className="meta-item">
                      <Phone size={16} />
                      <span>{professional.phone}</span>
                    </div>
                  </div>
                  
                  {professional.skills && (
                    <div className="skills">
                      {professional.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-professionals">No professionals available. Select a service type above.</p>
          )}
        </div>
      </div>

      {/* Booking Form */}
      {selectedProfessional && (
        <div className="booking-form">
          <h3>Book {selectedProfessional.name}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Service Type</label>
              <input
                type="text"
                name="service"
                value={bookingData.service}
                onChange={handleInputChange}
                placeholder="e.g., Kitchen Cabinet Installation"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Urgency</label>
              <select
                name="urgency"
                value={bookingData.urgency}
                onChange={handleInputChange}
              >
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Service Description</label>
              <textarea
                name="description"
                value={bookingData.description}
                onChange={handleInputChange}
                placeholder="Describe what you need done..."
                rows={3}
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label>Service Address</label>
              <input
                type="text"
                name="address"
                value={bookingData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Preferred Date</label>
              <input
                type="date"
                name="preferredDate"
                value={bookingData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Preferred Time</label>
              <select
                name="preferredTime"
                value={bookingData.preferredTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>
          </div>
          
          <div className="booking-summary">
            <div className="summary-item">
              <span>Professional:</span>
              <strong>{selectedProfessional.name}</strong>
            </div>
            <div className="summary-item">
              <span>Estimated Cost:</span>
              <strong>₹{selectedProfessional.pricing?.minimumRate || 800} minimum</strong>
            </div>
            <div className="summary-item">
              <span>Distance:</span>
              <strong>{calculateDistance(selectedProfessional).toFixed(1)} km away</strong>
            </div>
          </div>
          
          <button
            className="book-button"
            onClick={handleSubmitBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={20} className="spinner" />
                Sending Request...
              </>
            ) : (
              'Send Booking Request'
            )}
          </button>
        </div>
      )}

      {/* My Bookings */}
      <div className="my-bookings">
        <h3>My Bookings</h3>
        {myBookings.length === 0 ? (
          <p>No bookings yet. Book your first service above!</p>
        ) : (
          <div className="bookings-list">
            {myBookings.map(booking => (
              <div key={booking.id} className="booking-item">
                <div className="booking-header">
                  <h4>{booking.service}</h4>
                  <div className="status" style={{ color: getStatusColor(booking.status) }}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                  </div>
                </div>
                <div className="booking-details">
                  <p><strong>Professional:</strong> {booking.professionalName}</p>
                  <p><strong>Date:</strong> {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}</p>
                  <p><strong>Address:</strong> {booking.address}</p>
                  <p><strong>Description:</strong> {booking.description}</p>
                </div>
                <div className="booking-footer">
                  <small>Booked on {new Date(booking.createdAt).toLocaleDateString()}</small>
                  <span className="price">₹{booking.estimatedPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookService;