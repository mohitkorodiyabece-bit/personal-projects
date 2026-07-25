import React from 'react';

const FilterControls = ({ options, value, onChange, label = 'Filter by status' }) => {
  return (
    <div className="w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="input-field cursor-pointer"
      >
        <option value="">All statuses</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterControls;