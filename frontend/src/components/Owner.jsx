import React, { useEffect, useState } from "react";
import {
  getBookings,
  cancelBooking,
  updateBooking,
  getTables,
  addTable,
  deleteTable,
} from "../api";

import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";

import Charts from "./Charts";
import CustomerHome from "./customer/CustomerHome";
import CustomerTablePage from "./customer/CustomerTablePage";
import CustomerReserve from "./customer/CustomerReserve";

export default function Owner() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);

  const [newTableNum, setNewTableNum] = useState("");
  const [confirmData, setConfirmData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState("");

  /* ===============================
      LOAD TABLES (BACKEND + SYNC)
  =============================== */
  const loadTables = async () => {
    try {
      const res = await getTables();
      const list = res.data || [];

      setTables(list);
      localStorage.setItem("tables", JSON.stringify(list)); // ⭐ Sync to Customer
    } catch {
      setTables([1, 2, 3, 4, 5]);
    }
  };

  /* ===============================
      LOAD BOOKINGS
  =============================== */
  const loadBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data || []);
    } catch {}
  };

  useEffect(() => {
    loadTables();
    loadBookings();
  }, []);

  /* ===============================
      DASHBOARD NUMBERS
  =============================== */
  const today = bookings.length;
  const customers = bookings.reduce((s, b) => s + Number(b.people), 0);

  const [custPage, setCustPage] = useState("home");
  const [custSelectedTable, setCustSelectedTable] = useState(null);

  /* ⭐ IMPORTANT FIX — correct page mapping */
  const handleCustomerSetPage = (page) => {
    if (page === "customer") setCustPage("home");
    else if (page === "customer-table") setCustPage("table");
    else if (page === "customer-reserve") setCustPage("reserve");
    else setCustPage("home");
  };

  /* ===============================
      ADD TABLE
  =============================== */
  const handleAddTable = async () => {
    if (!newTableNum.trim()) return;

    try {
      await addTable(Number(newTableNum));
      setNewTableNum("");
      loadTables();
      setToast("Table added successfully.");
    } catch (err) {
      setToast(err.response?.data?.error || "Failed to add table.");
    }
  };

  /* ===============================
      DELETE TABLE
  =============================== */
  const handleDeleteTable = async (num) => {
    try {
      await deleteTable(num);
      loadTables();
      setToast("Table deleted.");
    } catch {
      setToast("Failed to delete table.");
    }
  };

  return (
    <div className="fade-in owner-page">

      {/* TOAST */}
      {toast && <div className="toast-box">{toast}</div>}

      <h2>Owner Panel Overview</h2>

      {/* DASHBOARD */}
      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <div className="dash-card">
          <div className="dash-title">Today's Bookings</div>
          <div className="dash-num">{today}</div>
        </div>
        <div className="dash-card">
          <div className="dash-title">Total Customers</div>
          <div className="dash-num">{customers}</div>
        </div>
        <div className="dash-card">
          <div className="dash-title">Tables Available</div>
          <div className="dash-num">{tables.length}</div>
        </div>
      </div>

      {/* TABLE MANAGER */}
      <h3>Table Manager</h3>
      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        {/* TABLE LIST */}
        <div style={{ marginBottom: 15 }}>
          {tables.map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 14px",
                background: "#f5f5f5",
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>Table {t}</span>
              <button
                className="pill-btn btn-cancel"
                style={{ padding: "6px 16px" }}
                onClick={() => handleDeleteTable(t)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* ADD TABLE */}
        <h4>Add Table</h4>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="number"
            placeholder="Table number"
            value={newTableNum}
            onChange={(e) => setNewTableNum(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          <button
            className="pill-btn btn-edit"
            onClick={handleAddTable}
            style={{ padding: "8px 18px" }}
          >
            Add
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <Charts bookings={bookings} />

      {/* CUSTOMER LIVE TABLE VIEW */}
      <h3 style={{ marginTop: 40 }}>Customer Live Table View</h3>
      <div className="card customer-live-card">
        <div className="customer-live-inner">
          {custPage === "home" && (
            <CustomerHome
              setPage={handleCustomerSetPage}
              setSelectedTable={setCustSelectedTable}
            />
          )}

          {custPage === "table" && (
            <CustomerTablePage
              tableId={custSelectedTable}
              setPage={handleCustomerSetPage}
            />
          )}

          {custPage === "reserve" && (
            <CustomerReserve
              selectedTable={custSelectedTable}
              setPage={handleCustomerSetPage}
              setToast={setToast}
            />
          )}
        </div>
      </div>

      {/* ALL BOOKINGS */}
      <h3 style={{ marginTop: 40 }}>All Reservations</h3>

      {bookings.length === 0 && <p className="empty">No reservations yet.</p>}

      {bookings.map((b) => (
        <div className="booking-card" key={b.id} style={{ position: "relative" }}>
          <div className="booking-info">
            <span className="booking-name">{b.name}</span>
            <span className="booking-meta">
              {b.people} people • Table {b.table}
            </span>
            <span className="booking-meta">{b.time}</span>
            <span className="booking-meta">
              📞 {b.phone?.trim() ? b.phone : "No phone"}
            </span>
          </div>

          <div className="booking-actions">
            <button
              className="pill-btn btn-edit"
              onClick={() => setEditData(b.id)}
            >
              Edit
            </button>

            <button
              className="pill-btn btn-cancel"
              onClick={() => setConfirmData({ bookingId: b.id, name: b.name })}
            >
              Cancel
            </button>
          </div>

          {/* EDIT POPUP */}
          {editData === b.id && (
            <EditDialog
              data={b}
              onCancel={() => setEditData(null)}
              onSave={async (updated) => {
                await updateBooking(b.id, updated);
                setEditData(null);
                loadBookings();
                setToast("Reservation updated.");
              }}
            />
          )}

          {/* CONFIRM DELETE */}
          {confirmData?.bookingId === b.id && (
            <ConfirmDialog
              message={`Cancel reservation for ${b.name}?`}
              onCancel={() => setConfirmData(null)}
              onConfirm={async () => {
                await cancelBooking(b.id);
                setConfirmData(null);
                loadBookings();
                setToast("Reservation cancelled.");
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
