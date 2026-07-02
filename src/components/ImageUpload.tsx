"use client";

import { useRef, useState } from "react";

type ImageUploadProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
};

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({ value, onChange, label = "Slika" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Dovoljeni formati: JPG, PNG, WEBP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Slika je prevelika (max 2 MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex items-start gap-4">
        {value ? (
          <img src={value} alt="Predogled" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-muted">
            ?
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background"
          >
            Naloži sliko
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-2 text-sm text-red-600 hover:underline"
            >
              Odstrani
            </button>
          )}
          <p className="text-xs text-muted">JPG, PNG ali WEBP, max 2 MB</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
