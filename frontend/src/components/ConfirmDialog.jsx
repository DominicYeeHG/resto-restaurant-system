import React from "react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-inline-box">
      <h4 className="confirm-inline-title">Confirm cancellation</h4>

      <p className="confirm-inline-msg">{message}</p>

      <div className="confirm-inline-btns">
        <button className="confirm-inline-no" onClick={onCancel}>
          No
        </button>
        <button className="confirm-inline-yes" onClick={onConfirm}>
          Yes, cancel
        </button>
      </div>
    </div>
  );
}
