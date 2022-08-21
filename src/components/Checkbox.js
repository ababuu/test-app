import React from "react";
import "../css/Checkbox.css";
export default function Checkbox({ label, onChange, id, value, checked }) {
  return (
    <div>
      <input
        name="applicable_items"
        id={id}
        type="checkbox"
        className="css-checkbox"
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id}></label>
      <span className="label">{label}</span>
    </div>
  );
}
