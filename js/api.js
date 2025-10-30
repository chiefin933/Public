const API_BASE_URL = "http://localhost:4000/api";

// Authentication functions
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const register = async (email, password, name, role = "CUSTOMER") => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, role }),
  });
  return response.json();
};

// Properties functions
export const getProperties = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/properties?${params}`);
  return response.json();
};

export const getMyProperties = async (token) => {
  const response = await fetch(`${API_BASE_URL}/properties/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Flights functions
export const getFlights = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/flights?${params}`);
  return response.json();
};

// Vehicles functions
export const getVehicles = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/vehicles?${params}`);
  return response.json();
};

// Booking functions
export const createBooking = async (bookingData, token) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  return response.json();
};

export const getMyBookings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/bookings/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Auth token management
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};