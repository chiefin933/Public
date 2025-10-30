import { login, register, getProperties, getFlights, getVehicles, getMyProperties, setToken, getToken, removeToken } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Handle authentication
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const response = await login(email, password);
        if (response.token) {
          setToken(response.token);
          document.body.classList.add('authenticated');
          window.location.href = '/';
        } else {
          alert(response.error || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = registerForm.email.value;
      const password = registerForm.password.value;
      const name = registerForm.name.value;
      const role = registerForm.role?.value || 'CUSTOMER';

      try {
        const response = await register(email, password, name, role);
        if (response.token) {
          setToken(response.token);
          document.body.classList.add('authenticated');
          window.location.href = '/';
        } else {
          alert(response.error || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      removeToken();
      document.body.classList.remove('authenticated');
      window.location.href = '/';
    });
  }

  // Header sign-in button (for sites that include a simple header fragment)
  const headerSignBtn = document.querySelector('.sign-in');
  const listPropertyBtn = document.querySelector('.list-property');
  const updateHeaderAuthState = () => {
    const token = getToken();
    if (headerSignBtn) headerSignBtn.textContent = token ? 'Sign Out' : 'Sign In';
    if (listPropertyBtn) listPropertyBtn.style.display = token ? 'inline-block' : 'none';
  };

  if (headerSignBtn) {
    headerSignBtn.addEventListener('click', async (e) => {
      const token = getToken();
      if (token) {
        // Sign out
        removeToken();
        document.body.classList.remove('authenticated');
        updateHeaderAuthState();
        window.location.href = '/';
        return;
      }

      // Show a minimal modal for login (lightweight fallback)
      const modal = document.createElement('div');
      modal.className = 'auth-modal';
      modal.style = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);z-index:9999;';
      modal.innerHTML = `
        <div style="background:#fff;padding:1.25rem;border-radius:12px;min-width:320px;max-width:420px;">
          <h3 style="margin-top:0">Sign In</h3>
          <form id="miniLoginForm">
            <label style="display:block;margin-bottom:0.25rem">Email</label>
            <input name="email" type="email" required style="width:100%;padding:0.5rem;margin-bottom:0.5rem" />
            <label style="display:block;margin-bottom:0.25rem">Password</label>
            <input name="password" type="password" required style="width:100%;padding:0.5rem;margin-bottom:0.75rem" />
            <div style="display:flex;gap:0.5rem;justify-content:flex-end">
              <button type="button" id="miniCancel" style="padding:0.5rem 0.75rem">Cancel</button>
              <button type="submit" style="padding:0.5rem 0.75rem">Sign In</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      const miniForm = document.getElementById('miniLoginForm');
      const miniCancel = document.getElementById('miniCancel');
      miniCancel?.addEventListener('click', () => { modal.remove(); });

      miniForm?.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const email = miniForm.email.value;
        const password = miniForm.password.value;
        try {
          const res = await login(email, password);
          if (res.token) {
            setToken(res.token);
            document.body.classList.add('authenticated');
            updateHeaderAuthState();
            modal.remove();
            window.location.href = '/';
          } else {
            alert(res.error || 'Login failed');
          }
        } catch (err) {
          console.error('Mini login error', err);
          alert('Login failed');
        }
      });
    });
  }

  updateHeaderAuthState();

  // Property listings
  const propertyList = document.getElementById('propertyList');
  if (propertyList) {
    try {
      const properties = await getProperties();
      propertyList.innerHTML = properties.map(property => `
        <div class="property-card">
          <img src="${property.images[0]}" alt="${property.title}">
          <h3>${property.title}</h3>
          <p>${property.description}</p>
          <p class="price">$${property.price}/night</p>
          <button onclick="bookProperty('${property.id}')">Book Now</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading properties:', error);
      propertyList.innerHTML = '<p>Error loading properties</p>';
    }
  }

  // If there's a section for the owner's properties, load protected list
  const myPropertyList = document.getElementById('myPropertyList');
  if (myPropertyList) {
    try {
      const token = getToken();
      if (!token) {
        myPropertyList.innerHTML = '<p>Please sign in to view your properties.</p>';
      } else {
        const myProps = await getMyProperties(token);
        myPropertyList.innerHTML = myProps.map(property => `
          <div class="property-card">
            <img src="${property.images[0] || ''}" alt="${property.title}">
            <h3>${property.title}</h3>
            <p>${property.description}</p>
            <p class="price">$${property.price}/night</p>
            <a href="/edit-property.html?id=${property.id}" class="btn">Edit</a>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading owner properties:', error);
      myPropertyList.innerHTML = '<p>Error loading your properties</p>';
    }
  }

  // Flight listings
  const flightList = document.getElementById('flightList');
  if (flightList) {
    const departureCity = document.getElementById('departureCity')?.value;
    const arrivalCity = document.getElementById('arrivalCity')?.value;
    const departureDate = document.getElementById('departureDate')?.value;

    try {
      const flights = await getFlights({ departureCity, arrivalCity, departureDate });
      flightList.innerHTML = flights.map(flight => `
        <div class="flight-card">
          <h3>${flight.airline}</h3>
          <p>${flight.flightNumber}</p>
          <p>${flight.departureCity} → ${flight.arrivalCity}</p>
          <p>Departure: ${new Date(flight.departureTime).toLocaleString()}</p>
          <p>Arrival: ${new Date(flight.arrivalTime).toLocaleString()}</p>
          <p class="price">$${flight.price}</p>
          <button onclick="bookFlight('${flight.id}')">Book Now</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading flights:', error);
      flightList.innerHTML = '<p>Error loading flights</p>';
    }
  }

  // Vehicle listings
  const vehicleList = document.getElementById('vehicleList');
  if (vehicleList) {
    const location = document.getElementById('location')?.value;
    const type = document.getElementById('vehicleType')?.value;

    try {
      const vehicles = await getVehicles({ location, type });
      vehicleList.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card">
          <img src="${vehicle.images[0]}" alt="${vehicle.make} ${vehicle.model}">
          <h3>${vehicle.make} ${vehicle.model}</h3>
          <p>${vehicle.year} - ${vehicle.type}</p>
          <p class="price">$${vehicle.price}/day</p>
          <button onclick="bookVehicle('${vehicle.id}')">Book Now</button>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading vehicles:', error);
      vehicleList.innerHTML = '<p>Error loading vehicles</p>';
    }
  }
});