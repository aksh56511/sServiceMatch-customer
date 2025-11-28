// Cross-App Synchronization Utility for Fixora
// This utility enables real-time communication between Customer and Professional apps

class CrossAppSync {
  constructor() {
    this.bookingsKey = 'fixora_bookings';
    this.professionalsKey = 'fixora_professional';
    this.syncKey = 'fixora_sync';
    this.init();
  }

  init() {
    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(this.bookingsKey)) {
      localStorage.setItem(this.bookingsKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.professionalsKey)) {
      localStorage.setItem(this.professionalsKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.syncKey)) {
      localStorage.setItem(this.syncKey, JSON.stringify({}));
    }
  }

  // Get available professionals by profession type
  getAvailableProfessionals(profession = null) {
    try {
      const professionals = JSON.parse(localStorage.getItem(this.professionalsKey) || '{}');
      const profList = Object.values(professionals).filter(prof => 
        prof.availability === 'available' && 
        (profession ? prof.profession.toLowerCase() === profession.toLowerCase() : true)
      );
      return profList;
    } catch (error) {
      console.error('Error getting professionals:', error);
      return [];
    }
  }

  // Create a new booking request
  createBookingRequest(customerId, customerName, professionalId, bookingData) {
    try {
      const bookingId = 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const booking = {
        id: bookingId,
        customerId,
        customerName,
        professionalId,
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const bookings = JSON.parse(localStorage.getItem(this.bookingsKey) || '{}');
      bookings[bookingId] = booking;
      localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));

      // Trigger real-time notification to professional app
      this.triggerSync('new_booking', {
        bookingId,
        booking,
        professionalId,
        customerName
      });

      return bookingId;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }

  // Get bookings for a specific customer
  getCustomerBookings(customerId) {
    try {
      const bookings = JSON.parse(localStorage.getItem(this.bookingsKey) || '{}');
      return Object.values(bookings).filter(booking => booking.customerId === customerId);
    } catch (error) {
      console.error('Error getting customer bookings:', error);
      return [];
    }
  }

  // Get a specific booking by ID
  getBooking(bookingId) {
    try {
      const bookings = JSON.parse(localStorage.getItem(this.bookingsKey) || '{}');
      return bookings[bookingId] || null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  // Listen for booking status updates from professional app
  onBookingUpdate(callback) {
    const handleStorageChange = (e) => {
      if (e.key === this.syncKey) {
        const syncData = JSON.parse(e.newValue || '{}');
        Object.values(syncData).forEach(event => {
          if (!event.processed && event.eventType === 'booking_status_update') {
            callback(event.data);
            // Mark as processed
            event.processed = true;
            localStorage.setItem(this.syncKey, JSON.stringify(syncData));
          }
        });
      }
    };

    const handleCustomEvent = (event) => {
      const { eventType, data } = event.detail;
      if (eventType === 'booking_status_update' || eventType === 'booking_response') {
        callback(data);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fixora_sync', handleCustomEvent);

    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('servicematch_sync', handleCustomEvent);
    };
  }

  // Trigger sync events for real-time communication
  triggerSync(eventType, data) {
    try {
      const syncData = JSON.parse(localStorage.getItem(this.syncKey) || '{}');
      const eventId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      syncData[eventId] = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
        processed: false
      };
      
      localStorage.setItem(this.syncKey, JSON.stringify(syncData));
      
      // Dispatch custom event for same-tab communication
      window.dispatchEvent(new CustomEvent('fixora_sync', {
        detail: { eventType, data, eventId }
      }));

      // Trigger storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.syncKey,
        newValue: JSON.stringify(syncData),
        storageArea: localStorage
      }));
      
      return eventId;
    } catch (error) {
      console.error('Error triggering sync:', error);
      return null;
    }
  }

  // Calculate distance between two points (customer and professional)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get professional profile by ID
  getProfessional(professionalId) {
    try {
      const professionals = JSON.parse(localStorage.getItem(this.professionalsKey) || '{}');
      return professionals[professionalId] || null;
    } catch (error) {
      console.error('Error getting professional:', error);
      return null;
    }
  }

  // Add some demo professionals for testing
  addDemoProfessionals() {
    const demoProfessionals = [
      {
        id: 'carpenter_demo',  // Match professional app IDs
        email: 'carpenter@demo.com',
        name: 'Rajesh Kumar',
        profession: 'Carpenter',
        phone: '+91 98765 43210',
        location: { city: 'Bangalore, Karnataka', lat: 12.9716, lng: 77.5946 },
        pricing: { hourlyRate: 400, minimumRate: 800 },
        bio: 'Experienced carpenter with 10+ years in residential and commercial projects.',
        rating: 4.8,
        availability: 'available',
        skills: ['Framing', 'Finishing', 'Repairs', 'Custom Work'],
        profilePicture: null
      },
      {
        id: 'plumber_demo',  // Match professional app IDs
        email: 'plumber@demo.com',
        name: 'Suresh Reddy',
        profession: 'Plumber',
        phone: '+91 87654 32109',
        location: { city: 'Bangalore, Karnataka', lat: 12.9716, lng: 77.5946 },
        pricing: { hourlyRate: 350, minimumRate: 700 },
        bio: 'Licensed plumber specializing in emergency repairs and installations.',
        rating: 4.9,
        availability: 'available',
        skills: ['Pipe Repair', 'Installation', 'Emergency', 'Drain Cleaning'],
        profilePicture: null
      },
      {
        id: 'electrician_demo',  // Match professional app IDs
        email: 'electrician@demo.com',
        name: 'Priya Sharma',
        profession: 'Electrician',
        phone: '+91 76543 21098',
        location: { city: 'Bangalore, Karnataka', lat: 12.9716, lng: 77.5946 },
        pricing: { hourlyRate: 450, minimumRate: 900 },
        bio: 'Master electrician with expertise in residential and commercial wiring.',
        rating: 4.7,
        availability: 'available',
        skills: ['Wiring', 'Panel Upgrades', 'Troubleshooting', 'Smart Home'],
        profilePicture: null
      }
    ];

    const professionals = JSON.parse(localStorage.getItem(this.professionalsKey) || '{}');
    demoProfessionals.forEach(prof => {
      professionals[prof.id] = prof;
    });
    localStorage.setItem(this.professionalsKey, JSON.stringify(professionals));
    
    return demoProfessionals;
  }
}

// Create and export singleton instance
const crossAppSync = new CrossAppSync();
export default crossAppSync;