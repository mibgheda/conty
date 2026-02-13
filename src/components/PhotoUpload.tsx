"use client";

import { useCallback, useState, useRef } from "react";
import { useI18n } from "@/i18n/context";

interface PhotoUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function PhotoUpload({
  onFileSelected,
  disabled,
}: PhotoUploadProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(t("errorFileSize"));
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert(t("errorFileType"));
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelected(file);
    },
    [onFileSelected, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={disabled ? undefined : handleClick}
      onDrop={disabled ? undefined : handleDrop}
      onDragOver={disabled ? undefined : handleDragOver}
      onDragLeave={disabled ? undefined : handleDragLeave}
      className={`
        relative w-full max-w-xl mx-auto rounded-2xl border-2 border-dashed transition-all duration-200
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${
          isDragging
            ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20 scale-[1.02]"
            : "border-neutral-300 dark:border-neutral-700 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="p-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-80 object-contain rounded-xl"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-violet-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {t("uploadTitle")}
          </p>
          <p className="text-sm text-neutral-500 mb-1">{t("uploadHint")}</p>
          <p className="text-xs text-neutral-400">{t("uploadFormats")}</p>
        </div>
      )}
    </div>
  );
}
