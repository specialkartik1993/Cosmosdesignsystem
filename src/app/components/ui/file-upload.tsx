"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Upload, CloudUpload, File, FileText, FileImage, FileVideo, FileAudio,
  X, Check, AlertCircle, Trash2, RotateCcw, Eye
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type FileUploadStatus = "pending" | "uploading" | "success" | "error";

export interface UploadFile {
  /** Unique identifier */
  id: string;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload status */
  status: FileUploadStatus;
  /** Upload progress 0–100 */
  progress: number;
  /** Optional preview URL */
  previewUrl?: string;
  /** Optional error message */
  error?: string;
}

export interface FileUploadProps {
  /** Current files */
  files?: UploadFile[];
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Max file size in bytes */
  maxSize?: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom dropzone label */
  label?: string;
  /** Custom dropzone description */
  description?: string;
  /** Accepted format badges */
  formats?: string[];
  /** View mode for file list */
  viewMode?: "list" | "grid";
  /** Called when files are added */
  onFilesAdd?: (files: File[]) => void;
  /** Called when a file is removed */
  onFileRemove?: (id: string) => void;
  /** Called when a file retry is requested */
  onFileRetry?: (id: string) => void;
  /** Called when all files are cleared */
  onClear?: () => void;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Utilities                                                           */
/* ------------------------------------------------------------------ */

/** Format bytes to human-readable size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  return (bytes / 1073741824).toFixed(1) + " GB";
}

/** Get icon component for a MIME type */
export function getFileIcon(type: string) {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf") || type.includes("doc") || type.includes("text")) return FileText;
  return File;
}

/** Get color classes for a MIME type */
export function getFileColor(type: string): string {
  if (type.startsWith("image/")) return "text-purple-500 bg-purple-500/10";
  if (type.startsWith("video/")) return "text-rose-500 bg-rose-500/10";
  if (type.startsWith("audio/")) return "text-amber-500 bg-amber-500/10";
  if (type.includes("zip") || type.includes("archive")) return "text-orange-500 bg-orange-500/10";
  if (type.includes("pdf")) return "text-red-500 bg-red-500/10";
  return "text-blue-500 bg-blue-500/10";
}

/** Status color mapping */
const statusColors: Record<FileUploadStatus, string> = {
  pending: "text-muted-foreground",
  uploading: "text-blue-500",
  success: "text-emerald-500",
  error: "text-red-500",
};

/* ------------------------------------------------------------------ */
/*  Sub-component: FileUploadDropzone                                   */
/* ------------------------------------------------------------------ */

export interface FileUploadDropzoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  formats?: string[];
  onFilesAdd?: (files: File[]) => void;
  className?: string;
}

export function FileUploadDropzone({
  accept, multiple = true, disabled, label, description, formats, onFilesAdd, className,
}: FileUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); if (!disabled) setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      onFilesAdd?.(Array.from(e.dataTransfer.files));
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFilesAdd?.(Array.from(e.target.files));
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      animate={{
        borderColor: isDragOver ? "#818cf8" : "rgba(255,255,255,0.08)",
        scale: isDragOver ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex flex-col items-center justify-center py-12 px-6 rounded-2xl border-2 border-dashed cursor-pointer group hover:border-primary/40 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        isDragOver && "bg-primary/5",
        className
      )}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleInputChange} />
      <motion.div animate={{ y: isDragOver ? -8 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
          <CloudUpload className="w-8 h-8 text-primary" />
        </div>
      </motion.div>
      <p className="text-[14px] mb-1" style={{ fontWeight: 600 }}>
        {isDragOver ? "Drop files to upload" : label || "Drag & drop files here, or click to browse"}
      </p>
      <p className="text-[12px] text-muted-foreground">
        {description || "Supports all common file formats"}
      </p>
      {formats && formats.length > 0 && (
        <div className="flex items-center gap-3 mt-4">
          {formats.map((ext) => (
            <span key={ext} className="px-2 py-0.5 rounded-md bg-muted text-[9px] text-muted-foreground" style={{ fontWeight: 600 }}>
              {ext}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: FileUploadItem                                       */
/* ------------------------------------------------------------------ */

export interface FileUploadItemProps {
  file: UploadFile;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

export function FileUploadItem({ file, onRemove, onRetry, className }: FileUploadItemProps) {
  const Icon = getFileIcon(file.type);
  const colorClass = getFileColor(file.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors group",
        className
      )}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] truncate" style={{ fontWeight: 500 }}>{file.name}</span>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">{formatFileSize(file.size)}</span>
        </div>
        {file.status === "uploading" && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${file.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums" style={{ fontWeight: 500 }}>
              {Math.round(file.progress)}%
            </span>
          </div>
        )}
        {file.status === "success" && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-500 mt-0.5" style={{ fontWeight: 500 }}>
            <Check className="w-3 h-3" />Uploaded
          </span>
        )}
        {file.status === "error" && (
          <span className="flex items-center gap-1 text-[10px] text-red-500 mt-0.5" style={{ fontWeight: 500 }}>
            <AlertCircle className="w-3 h-3" />{file.error || "Upload failed"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.status === "error" && onRetry && (
          <button onClick={() => onRetry(file.id)} className="p-1.5 rounded-lg hover:bg-accent cursor-pointer" title="Retry">
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
        {onRemove && (
          <button onClick={() => onRemove(file.id)} className="p-1.5 rounded-lg hover:bg-accent cursor-pointer" title="Remove">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: FileUploadList                                       */
/* ------------------------------------------------------------------ */

export interface FileUploadListProps {
  files: UploadFile[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

export function FileUploadList({ files, onRemove, onRetry, className }: FileUploadListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="popLayout">
        {files.map((file) => (
          <FileUploadItem key={file.id} file={file} onRemove={onRemove} onRetry={onRetry} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: FileUploadAvatarZone                                 */
/* ------------------------------------------------------------------ */

export interface FileUploadAvatarZoneProps {
  /** Current avatar URL */
  value?: string | null;
  /** Callback on file select */
  onChange?: (file: File | null) => void;
  /** Size in pixels */
  size?: number;
  /** Accepted types */
  accept?: string;
  /** Placeholder initials */
  initials?: string;
  className?: string;
}

export function FileUploadAvatarZone({
  value, onChange, size = 96, accept = "image/*", initials = "?", className,
}: FileUploadAvatarZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(value || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(file);
    }
  };

  return (
    <div
      className={cn("relative cursor-pointer group", className)}
      onClick={() => inputRef.current?.click()}
      style={{ width: size, height: size }}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-dashed border-border group-hover:border-primary/40 transition-colors">
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center text-muted-foreground text-[20px]" style={{ fontWeight: 700 }}>
            {initials}
          </div>
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Upload className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook: useFileUpload                                                 */
/* ------------------------------------------------------------------ */

export interface UseFileUploadOptions {
  /** Simulated upload duration in ms (for demo) */
  simulateDelay?: number;
  /** Max file size in bytes */
  maxSize?: number;
  /** Accepted MIME type patterns */
  acceptTypes?: string[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { simulateDelay = 200, maxSize, acceptTypes } = options;
  const [files, setFiles] = React.useState<UploadFile[]>([]);

  const addFiles = React.useCallback((newFiles: File[]) => {
    const additions: UploadFile[] = newFiles.map((f, i) => {
      const id = `upload-${Date.now()}-${i}`;
      const isValid = (!maxSize || f.size <= maxSize) &&
        (!acceptTypes || acceptTypes.some((t) => f.type.match(new RegExp(t.replace("*", ".*")))));
      return {
        id,
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        status: isValid ? ("uploading" as const) : ("error" as const),
        progress: 0,
        error: isValid ? undefined : maxSize && f.size > maxSize ? "File too large" : "Unsupported type",
      };
    });
    setFiles((prev) => [...additions, ...prev]);

    // Simulate upload progress
    additions
      .filter((f) => f.status === "uploading")
      .forEach((file) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 100) {
            clearInterval(interval);
            setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 100, status: "success" } : f)));
          } else {
            setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: Math.min(progress, 99) } : f)));
          }
        }, simulateDelay);
      });
  }, [maxSize, acceptTypes, simulateDelay]);

  const removeFile = React.useCallback((id: string) => setFiles((prev) => prev.filter((f) => f.id !== id)), []);
  const retryFile = React.useCallback((id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading" as const, progress: 0, error: undefined } : f)));
  }, []);
  const clearAll = React.useCallback(() => setFiles([]), []);

  const completedCount = files.filter((f) => f.status === "success").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return {
    files, setFiles, addFiles, removeFile, retryFile, clearAll,
    completedCount, uploadingCount, totalSize,
  };
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type {
  FileUploadProps,
  FileUploadDropzoneProps,
  FileUploadItemProps,
  FileUploadListProps,
  FileUploadAvatarZoneProps,
  UseFileUploadOptions,
};