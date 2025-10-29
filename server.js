// Minimal Express server stub for BookItNow demo
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/ping', (req,res)=> res.json({ok:true, time: Date.now()}));

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
