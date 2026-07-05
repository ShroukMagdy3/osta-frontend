'use client';

import { useState, useRef } from 'react';
import { ImageUp, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function FileUpload({ label, value, onChange, error }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-1.5" dir="rtl">
      <label className="text-sm font-medium text-[var(--primary-color)]">{label}</label>

      <div
        onClick={() => !preview && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          relative border-2 border-dashed rounded-2xl transition-all
          ${preview ? 'border-[var(--accent-color)] p-0 overflow-hidden' : 'border-gray-200 hover:border-gray-300 cursor-pointer p-4'}
          ${error ? 'border-red-400' : ''}
        `}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-2xl" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="absolute top-2 left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <ImageUp size={28} className="text-gray-300" />
            <p className="text-xs text-gray-400 text-center">
              اسحب وأفلت الصورة هنا أو اضغط لرفعها
            </p>
            <p className="text-xs text-gray-300">JPG, PNG بحد أقصى 50 ميجابايت</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}