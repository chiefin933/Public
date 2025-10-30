// Import auth-related functions
import { login, register, setToken, getToken, removeToken } from "./js/api.js";

// Check for authentication and update UI accordingly
function updateAuthState() {
  const token = getToken();
  if (token) {
    document.body.classList.add('authenticated');
  } else {
    document.body.classList.remove('authenticated');
  }
}

// Show error message in form
function showError(form, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.textContent = message;
  form.querySelector('button[type="submit"]').before(errorDiv);
}

// Close all modals
function closeModals() {
  const modals = document.querySelectorAll('.auth-modal');
  modals.forEach(modal => modal.classList.add('hidden'));
  
  // Reset forms
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => {
    if (form) form.reset();
  });
  
  // Remove error messages
  document.querySelectorAll('.form-error').forEach(error => error.remove());
}

// Initialize auth state on page load
updateAuthState();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Get modal elements
  const signInModal = document.getElementById('signInModal');
  const signUpModal = document.getElementById('signUpModal');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');

  // Get button elements
  const signInBtn = document.querySelector('.sign-in');
  const signOutBtn = document.querySelector('.sign-out');
  const listPropertyBtn = document.querySelector('.list-property');

  // Sign In button click
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      signInModal.classList.remove('hidden');
      const emailInput = document.getElementById('signInEmail');
      if (emailInput) emailInput.focus();
    });
  }

  // Sign Out button click
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      removeToken();
      updateAuthState();
    });
  }

  // List Property button click
  if (listPropertyBtn) {
    listPropertyBtn.addEventListener('click', () => {
      if (!getToken()) {
        signInModal.classList.remove('hidden');
      } else {
        alert('Redirecting to property listing form...');
      }
    });
  }

  // Close button handlers
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  // Modal click outside to close
  document.querySelectorAll('.auth-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModals();
    });
  });

  // Switch between modals
  document.querySelectorAll('.switch-to-signup').forEach(btn => {
    btn.addEventListener('click', () => {
      signInModal.classList.add('hidden');
      signUpModal.classList.remove('hidden');
    });
  });

  document.querySelectorAll('.switch-to-signin').forEach(btn => {
    btn.addEventListener('click', () => {
      signUpModal.classList.add('hidden');
      signInModal.classList.remove('hidden');
    });
  });

  // Sign In form submission
  if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous errors
      signInForm.querySelectorAll('.form-error').forEach(error => error.remove());
      
      const email = signInForm.querySelector('[name="email"]').value.trim();
      const password = signInForm.querySelector('[name="password"]').value;
      
      if (!email || !password) {
        showError(signInForm, 'Please fill in all fields');
        return;
      }

      try {
        const response = await login(email, password);
        if (response && response.token) {
          setToken(response.token);
          updateAuthState();
          closeModals();
        } else {
          throw new Error('Login failed: Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        showError(signInForm, error.message || 'Invalid email or password');
      }
    });
  }

  // Sign Up form submission
  if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous errors
      signUpForm.querySelectorAll('.form-error').forEach(error => error.remove());
      
      const name = signUpForm.querySelector('[name="name"]').value.trim();
      const email = signUpForm.querySelector('[name="email"]').value.trim();
      const password = signUpForm.querySelector('[name="password"]').value;
      const confirmPassword = signUpForm.querySelector('[name="confirmPassword"]').value;
      
      if (!name || !email || !password || !confirmPassword) {
        showError(signUpForm, 'Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        showError(signUpForm, 'Passwords do not match');
        return;
      }
      
      try {
        const response = await register(email, password, name);
        if (response && response.token) {
          setToken(response.token);
          updateAuthState();
          closeModals();
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        showError(signUpForm, error.message || 'Registration failed. Please try again.');
      }
    });
  }
});
