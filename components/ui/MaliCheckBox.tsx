'use client';
import React from "react";

interface MaliCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const MaliCheckbox: React.FC<MaliCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{ transform: "translateY(+2px)" }}
      className="w-[15px] h-[15px] border border-gray-700 flex items-center justify-center cursor-pointer select-none"
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="12px"
          height="12px"
        >
          <path d="M18 6L6 18M6 6l12 12" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

export default MaliCheckbox;
