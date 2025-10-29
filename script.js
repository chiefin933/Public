// --- Guest Counter ---
const guestsInput = document.getElementById('guests');
document.querySelector('.guests-plus').addEventListener('click', () => {
  let val = parseInt(guestsInput.value, 10);
  if (val < 20) guestsInput.value = val + 1;
});
document.querySelector('.guests-minus').addEventListener('click', () => {
  let val = parseInt(guestsInput.value, 10);
  if (val > 1) guestsInput.value = val - 1;
});

// --- Date Picker Modal ---
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const calendarModal = document.getElementById('calendar-modal');
let activeDateInput = null;

function openCalendar(input) {
  activeDateInput = input;
  calendarModal.classList.remove('hidden');
  renderCalendar();
}

checkinInput.addEventListener('click', () => openCalendar(checkinInput));
checkoutInput.addEventListener('click', () => openCalendar(checkoutInput));

function renderCalendar() {
  // Simple calendar for current month (for demo)
  const today = new Date();
  let html = '<div style="background:#fff;padding:2rem;border-radius:18px;min-width:320px;box-shadow:0 2px 16px rgba(16,42,67,0.12);position:relative;">';
  html += '<button id="closeCalendar" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.2rem;cursor:pointer;">&times;</button>';
  html += `<h3 style="margin-bottom:1rem;">${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}</h3>`;
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.3rem;text-align:center;">';
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  days.forEach(d => html += `<div style="color:#888;font-weight:600;">${d}</div>`);
  let firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  let daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
  for (let i=0; i<firstDay; i++) html += '<div></div>';
  for (let d=1; d<=daysInMonth; d++) {
    html += `<button class="calendar-day" data-day="${d}" style="background:#FAF9F6;border:none;border-radius:8px;padding:0.5rem 0;cursor:pointer;">${d}</button>`;
  }
  html += '</div></div>';
  calendarModal.innerHTML = html;
  document.getElementById('closeCalendar').onclick = () => calendarModal.classList.add('hidden');
  document.querySelectorAll('.calendar-day').forEach(btn => {
    btn.onclick = function() {
      const date = new Date(today.getFullYear(), today.getMonth(), parseInt(this.dataset.day,10));
      activeDateInput.value = date.toISOString().slice(0,10);
      calendarModal.classList.add('hidden');
    };
  });
}

// --- Form Validation ---
document.getElementById('searchForm').addEventListener('submit', function(e) {
  if (!document.getElementById('destination').value.trim()) {
    alert('Please enter a destination.');
    e.preventDefault();
    return;
  }
  if (!checkinInput.value || !checkoutInput.value) {
    alert('Please select check-in and check-out dates.');
    e.preventDefault();
    return;
  }
});
