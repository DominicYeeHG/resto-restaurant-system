import React, { useState } from "react";
import "./EditDialog.css";

export default function EditDialog({ data, onCancel, onSave }) {
  const [name, setName] = useState(data.name);
  const [phone, setPhone] = useState(data.phone || "");
  const [people, setPeople] = useState(data.people);
  const [table, setTable] = useState(data.table);
  const [time, setTime] = useState(data.time);

  return (
    <div className="edit-inline-box">
      <h4 className="edit-inline-title">Edit Reservation</h4>

      <div className="edit-inline-field">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="edit-inline-field">
        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="edit-inline-field">
        <label>People</label>
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
      </div>

      <div className="edit-inline-field">
        <label>Table</label>
        <input
          type="number"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      </div>

      <div className="edit-inline-field">
        <label>Time</label>
        <input
          list="timeSlots"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <datalist id="timeSlots">
          {[
            "10:00 - 11:00",
            "11:00 - 12:00",
            "12:00 - 13:00",
            "13:00 - 14:00",
            "14:00 - 15:00",
            "15:00 - 16:00",
            "16:00 - 17:00",
            "17:00 - 18:00",
            "18:00 - 19:00",
            "19:00 - 20:00",
            "20:00 - 21:00",
            "21:00 - 22:00",
          ].map((slot) => (
            <option key={slot} value={slot} />
          ))}
        </datalist>
      </div>

      <div className="edit-inline-btns">
        <button className="edit-inline-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="edit-inline-save"
          onClick={() =>
            onSave({ name, phone, people, table, time })
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}
