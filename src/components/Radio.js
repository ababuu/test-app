import React from "react";
import "../css/Radio.css";

export default function Radio({ id, label, handleChange, value, checked }) {
  return (
    <div className="radio-container">
      <input
        id={id}
        className="radio-custom"
        name="applied_to"
        type="radio"
        value={value}
        onChange={handleChange}
        checked={checked}
      />
      <label htmlFor={id} className="radio-custom-label"></label>
      <span className="radio-label">{label}</span>
    </div>
  );
}
