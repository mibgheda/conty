"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/i18n/context";
import type { PromptBlock as PromptBlockType } from "@/lib/types";

interface PromptBlockProps {
  block: PromptBlockType;
  onEdit: (content: string) => void;
}

export default function PromptBlockCard({ block, onEdit }: PromptBlockProps) {
  const { locale, t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(block.content);
  }, [block.content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    onEdit(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(block.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="group relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{block.icon}</span>
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
            {block.label[locale]}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
              title={t("editBlock")}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`text-xs px-2.5 py-1 rounded-md transition-all ${
              copied
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t("copied")}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                {t("copyBlock")}
              </span>
            )}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed bg-violet-50 dark:bg-violet-950/20 border border-violet-300 dark:border-violet-700 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="text-xs px-3 py-1 rounded-md bg-violet-500 text-white hover:bg-violet-600 transition-colors"
            >
              {t("saveEdit")}
            </button>
            <button
              onClick={handleCancel}
              className="text-xs px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              {t("cancelEdit")}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {block.content}
        </p>
      )}
    </div>
  );
}
