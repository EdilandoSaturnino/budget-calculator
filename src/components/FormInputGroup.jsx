import React from "react";

function FormInputGroup({
  text,
  icon,
  placeholder,
  value,
  onInput,
  onChange,
  list,
  readOnly = false,
}) {
  return (
    <div className="input-group mb-3">
      <span className="input-group-text">
        {text} {icon}
      </span>
      <input
        list={list}
        type="text"
        value={value}
        className="form-control"
        placeholder={placeholder}
        onInput={onInput}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
}

export default FormInputGroup;
