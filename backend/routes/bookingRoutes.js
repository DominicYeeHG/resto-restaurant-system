const express = require("express");
const router = express.Router();

let bookings = [];

/* ----------------- CREATE BOOKING ----------------- */
router.post("/", (req, res) => {
  const { name, people, table, time, phone } = req.body;

  // ⭐ phone 是必须的（你前端表单也要求）
  if (!name || !people || !table || !time || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 检查重复预约
  const exists = bookings.some(
    (b) => Number(b.table) === Number(table) && b.time === time
  );

  if (exists) {
    return res.status(400).json({
      error: "This time slot is already booked for this table.",
    });
  }

  // ⭐ 必须保存 phone
  const newBooking = {
    id: Date.now(),
    name,
    people,
    table,
    time,
    phone,
  };

  bookings.push(newBooking);
  res.json(newBooking);
});

/* ----------------- READ ALL ----------------- */
router.get("/", (req, res) => {
  res.json(bookings);
});

/* ----------------- READ BY TABLE ----------------- */
router.get("/table/:id", (req, res) => {
  const tableId = Number(req.params.id);
  const filtered = bookings.filter((b) => Number(b.table) === tableId);
  res.json(filtered);
});

/* ----------------- UPDATE BOOKING ----------------- */
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).json({ error: "Booking not found" });

  // 时间冲突检查
  if (req.body.table || req.body.time) {
    const table = req.body.table || bookings[index].table;
    const time = req.body.time || bookings[index].time;

    const conflict = bookings.some(
      (b) =>
        b.id !== id &&
        Number(b.table) === Number(table) &&
        b.time === time
    );

    if (conflict) {
      return res
        .status(400)
        .json({ error: "This time slot is already booked for this table." });
    }
  }

  // ⭐ 更新 phone（你之前完全没更新）
  bookings[index] = { ...bookings[index], ...req.body };

  res.json(bookings[index]);
});

/* ----------------- DELETE ----------------- */
router.delete("/:id", (req, res) => {
  bookings = bookings.filter((b) => b.id !== Number(req.params.id));
  res.json({ success: true });
});

module.exports = router;
