fetch('http://localhost:3000/api/v1/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resourceId: "11e68513-fff6-415a-928e-12b79ed3c137",
    userId: "99e68513-fff6-415a-928e-12b79ed3c999",
    date: "2026-07-18"
  })
})
.then(res => res.json())
.then(data => console.log("ODPOWIEDŹ Z SERWERA:", data))
.catch(err => console.error("BŁĄD:", err));
