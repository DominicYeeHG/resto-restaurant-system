import React, { useEffect, useState } from "react";
import { getTables, addTable, deleteTable } from "../api";
import "./TablesManager.css";

export default function TablesManager() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState("");

  const load = async () => {
    try {
      const res = await getTables();
      setTables(res.data || []);
      localStorage.setItem("tables", JSON.stringify(res.data || []));
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!newTable) return;
    try {
      await addTable(newTable);
      setNewTable("");
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Add failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTable(id);
      load();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="table-manager">
      <h3 className="tm-title">Table Manager</h3>

      <div className="tm-list">
        {tables.map((t) => (
          <div className="tm-row" key={t}>
            <span>Table {t}</span>
            <button className="tm-delete" onClick={() => handleDelete(t)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="tm-add-box">
        <input
          type="number"
          placeholder="Enter new table number"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
        />
        <button className="tm-add" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
