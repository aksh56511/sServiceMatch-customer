// API Service for communicating with backend
const API_BASE_URL = 'http://localhost:5000/api';

class APIService {
  // ===== PROFESSIONALS =====
  
  static async getProfessionals(profession = null) {
    try {
      const url = profession 
        ? `${API_BASE_URL}/professionals?profession=${profession}`
        : `${API_BASE_URL}/professionals`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch professionals');
      return await response.json();
    } catch (error) {
      console.error('Error getting professionals:', error);
      return [];
    }
  }

  static async getProfessional(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/professionals/${id}`);
      if (!response.ok) throw new Error('Professional not found');
      return await response.json();
    } catch (error) {
      console.error('Error getting professional:', error);
      return null;
    }
  }

  static async updateProfessional(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/professionals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update professional');
      return await response.json();
    } catch (error) {
      console.error('Error updating professional:', error);
      return null;
    }
  }

  // ===== BOOKINGS =====

  static async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }

  static async getCustomerBookings(customerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/customer/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return await response.json();
    } catch (error) {
      console.error('Error getting customer bookings:', error);
      return [];
    }
  }

  static async getProfessionalBookings(professionalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/professional/${professionalId}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return await response.json();
    } catch (error) {
      console.error('Error getting professional bookings:', error);
      return [];
    }
  }

  static async getBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
      if (!response.ok) throw new Error('Booking not found');
      return await response.json();
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  static async updateBooking(bookingId, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update booking');
      return await response.json();
    } catch (error) {
      console.error('Error updating booking:', error);
      return null;
    }
  }

  // ===== CHAT =====

  static async sendMessage(messageData) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  static async getMessages(bookingId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/messages?bookingId=${bookingId}&userId=${userId}`
      );
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // ===== REVIEWS =====

  static async addReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) throw new Error('Failed to add review');
      return await response.json();
    } catch (error) {
      console.error('Error adding review:', error);
      return null;
    }
  }

  static async getReviews(professionalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${professionalId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json();
    } catch (error) {
      console.error('Error getting reviews:', error);
      return { rating: 0, reviews: [] };
    }
  }

  // ===== POLLING FOR REAL-TIME UPDATES =====

  static startPolling(callback, interval = 3000) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          callback();
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
    
    return () => clearInterval(pollInterval);
  }
}

// Export for use in React components
export default APIService;
