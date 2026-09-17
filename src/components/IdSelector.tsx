'use client';
import { useState } from 'react';

export default function IdSelector({ onSelect }: { onSelect: (idType: string) => void }) {
  const [selected, setSelected] = useState('ABHA');

  const options = ['ABHA ID', 'Aadhaar Card', 'Mobile OTP'];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Authentication Mode</label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setSelected(opt);
              onSelect(opt);
            }}
            className={`py-2.5 px-4 text-sm font-medium rounded-lg border transition ${
              selected === opt 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}