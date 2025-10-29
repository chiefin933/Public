// --- Guest Counter ---
const guestsInput = document.getElementById('guests');
document.querySelector('.guests-plus').addEventListener('click', () => {
  let val = parseInt(guestsInput.value, 10) || 1;
  if (val < 20) guestsInput.value = val + 1;
});
document.querySelector('.guests-minus').addEventListener('click', () => {
  let val = parseInt(guestsInput.value, 10) || 1;
  if (val > 1) guestsInput.value = val - 1;
});

// --- Date Range Picker Modal ---
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const calendarModal = document.getElementById('calendar-modal');
let selectedStart = null;
let selectedEnd = null;

function openCalendar() {
  // reset selections so user picks a fresh range
  selectedStart = null;
  selectedEnd = null;
  calendarModal.classList.remove('hidden');
  renderCalendar();
}

checkinInput.addEventListener('click', openCalendar);
checkoutInput.addEventListener('click', openCalendar);

function formatISO(date) {
  return date.toISOString().slice(0,10);
}

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  let html = '<div style="background:#fff;padding:1rem;border-radius:18px;min-width:320px;box-shadow:0 2px 16px rgba(16,42,67,0.12);position:relative;">';
  html += '<button id="closeCalendar" style="position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;font-size:1.4rem;cursor:pointer;">&times;</button>';
  html += `<h3 style="margin:0 0 0.8rem 0;">${today.toLocaleString('default', { month: 'long' })} ${year}</h3>`;
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.25rem;text-align:center;margin-bottom:0.5rem;">';
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  days.forEach(d => html += `<div style="color:#888;font-weight:600;">${d}</div>`);
  html += '</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.3rem;text-align:center;">';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i=0; i<firstDay; i++) html += '<div></div>';

  for (let d=1; d<=daysInMonth; d++) {
    const dayDate = new Date(year, month, d);
    const iso = formatISO(dayDate);
    html += `<button class="calendar-day" data-iso="${iso}">${d}</button>`;
  }

  html += '</div></div>';
  calendarModal.innerHTML = html;

  document.getElementById('closeCalendar').onclick = () => calendarModal.classList.add('hidden');

  // attach handlers
  document.querySelectorAll('.calendar-day').forEach(btn => {
    btn.addEventListener('click', () => {
      const iso = btn.dataset.iso;
      const clicked = new Date(iso);
      if (!selectedStart || (selectedStart && selectedEnd)) {
        // start new selection
        selectedStart = clicked;
        selectedEnd = null;
      } else if (selectedStart && !selectedEnd) {
        // set end (ensure end >= start)
        if (clicked < selectedStart) {
          // clicked before start — make it the new start
          selectedStart = clicked;
        } else {
          selectedEnd = clicked;
          // selection complete: populate inputs and close
          checkinInput.value = formatISO(selectedStart);
          checkoutInput.value = formatISO(selectedEnd);
          calendarModal.classList.add('hidden');
        }
      }
      updateCalendarClasses();
    });
  });
}

function updateCalendarClasses() {
  document.querySelectorAll('.calendar-day').forEach(btn => {
    const iso = btn.dataset.iso;
    btn.classList.remove('day--selected', 'day--inrange');
    if (selectedStart && iso === formatISO(selectedStart)) btn.classList.add('day--selected');
    if (selectedEnd && iso === formatISO(selectedEnd)) btn.classList.add('day--selected');
    if (selectedStart && selectedEnd) {
      const d = new Date(iso);
      if (d > selectedStart && d < selectedEnd) btn.classList.add('day--inrange');
    }
  });
}

// close when clicking outside
calendarModal.addEventListener('click', (e) => {
  if (e.target === calendarModal) calendarModal.classList.add('hidden');
});

// --- Form Validation ---
document.getElementById('searchForm').addEventListener('submit', function(e) {
  const dest = document.getElementById('destination').value.trim();
  if (!dest) {
    alert('Please enter a destination.');
    e.preventDefault();
    return;
  }
  if (!checkinInput.value || !checkoutInput.value) {
    alert('Please select check-in and check-out dates.');
    e.preventDefault();
    return;
  }
  // ensure checkin < checkout
  const start = new Date(checkinInput.value);
  const end = new Date(checkoutInput.value);
  if (start >= end) {
    alert('Check-out date must be after check-in date.');
    e.preventDefault();
    return;
  }
});
