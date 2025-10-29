/* Minimal Express server for BookItNow demo
Endpoints:
  GET  /api/bookings  -> returns array of bookings
  POST /api/bookings  -> accepts booking object and appends to bookings.json

This file is intentionally small and uses the filesystem to persist data.
*/

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const PORT = process.env.PORT || 3000;
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

const app = express();
app.use(cors());
app.use(express.json());

// helper to read bookings.json (returns [])
async function readBookings(){
  try{
    const txt = await fs.readFile(BOOKINGS_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  }catch(e){
    return [];
  }
}

// helper to write bookings
async function writeBookings(arr){
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

app.get('/api/bookings', async (req, res) => {
  const items = await readBookings();
  res.json(items);
});

app.post('/api/bookings', async (req, res) => {
  const { name, email, date, time, duration } = req.body || {};
  if(!name || !email || !date || !time){
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const booking = { id: Date.now(), name, email, date, time, duration: duration || 1 };
  const items = await readBookings();
  items.push(booking);
  try{
    await writeBookings(items);
    res.status(201).json(booking);
  }catch(e){
    console.error('Failed to save booking', e);
    res.status(500).json({ error: 'Failed to persist booking' });
  }
});

app.listen(PORT, ()=>{
  console.log(`BookItNow demo server running on http://localhost:${PORT}`);
});
