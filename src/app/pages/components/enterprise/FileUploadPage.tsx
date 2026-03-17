import { useState, useRef, useCallback } from 'react';
import { ComponentPage, Showcase } from '../ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Upload, CloudUpload, File, FileText, FileImage, FileVideo, FileAudio,
  FileArchive, X, Check, AlertCircle, Trash2, Download, Eye, RotateCcw,
  ImagePlus, Paperclip, FolderUp, HardDrive, Link2, ChevronRight
} from 'lucide-react';

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error' | 'pending';
  progress: number;
}

const fmtSize = (b: number) => {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo;
  if (type.startsWith('audio/')) return FileAudio;
  if (type.includes('zip') || type.includes('archive') || type.includes('tar')) return FileArchive;
  if (type.includes('pdf') || type.includes('doc') || type.includes('text')) return FileText;
  return File;
};

const getFileColor = (type: string) => {
  if (type.startsWith('image/')) return 'text-purple-500 bg-purple-500/10';
  if (type.startsWith('video/')) return 'text-rose-500 bg-rose-500/10';
  if (type.startsWith('audio/')) return 'text-amber-500 bg-amber-500/10';
  if (type.includes('zip') || type.includes('archive')) return 'text-orange-500 bg-orange-500/10';
  if (type.includes('pdf')) return 'text-red-500 bg-red-500/10';
  return 'text-blue-500 bg-blue-500/10';
};

const mockFiles: UploadFile[] = [
  { id: '1', name: 'design-system-v2.fig', size: 14200000, type: 'application/fig', status: 'success', progress: 100 },
  { id: '2', name: 'brand-guidelines.pdf', size: 8500000, type: 'application/pdf', status: 'success', progress: 100 },
  { id: '3', name: 'hero-banner.png', size: 3200000, type: 'image/png', status: 'uploading', progress: 67 },
  { id: '4', name: 'product-demo.mp4', size: 45800000, type: 'video/mp4', status: 'uploading', progress: 34 },
  { id: '5', name: 'component-library.zip', size: 22100000, type: 'application/zip', status: 'pending', progress: 0 },
  { id: '6', name: 'broken-file.xlsx', size: 1200000, type: 'application/xlsx', status: 'error', progress: 0 },
];

export function FileUploadPage() {
  const [files, setFiles] = useState<UploadFile[]>(mockFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Simulate upload progress
  const simulateUpload = useCallback((id: string) => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setFiles(p => p.map(f => f.id === id ? { ...f, progress: 100, status: 'success' } : f));
      } else {
        setFiles(p => p.map(f => f.id === id ? { ...f, progress: Math.min(prog, 99) } : f));
      }
    }, 200);
  }, []);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const additions: UploadFile[] = Array.from(newFiles).map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      status: 'uploading' as const,
      progress: 0,
    }));
    setFiles(p => [...additions, ...p]);
    additions.forEach(f => simulateUpload(f.id));
  };

  const removeFile = (id: string) => setFiles(p => p.filter(f => f.id !== id));
  const retryFile = (id: string) => { setFiles(p => p.map(f => f.id === id ? { ...f, status: 'uploading', progress: 0 } : f)); simulateUpload(id); };
  const clearAll = () => setFiles([]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); addFiles(e.dataTransfer.files); };

  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const completedCount = files.filter(f => f.status === 'success').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;

  return (
    <ComponentPage title="File Upload" description="Enterprise file upload with drag-and-drop, progress tracking, file validation, thumbnail previews, and multiple upload zones.">
      {/* Main Upload Zone */}
      <Showcase title="Drag & Drop Zone" description="Full-featured upload zone with drag-and-drop, file browser, and real-time progress tracking." delay={0.05} code={`import {
  FileUploadDropzone,
  FileUploadList,
  useFileUpload,
  formatFileSize,
} from '@cosmos-ds/react';
// Also available: FileUploadItem, FileUploadAvatarZone,
// getFileIcon, getFileColor

const { files, addFiles, removeFile, retryFile, clearAll,
        completedCount, uploadingCount, totalSize } = useFileUpload({
  maxSize: 50 * 1024 * 1024,   // 50MB limit
  simulateDelay: 200,           // demo upload speed
});

<FileUploadDropzone
  accept="image/*,.pdf,.zip,.fig"
  multiple
  label="Drag & drop files here, or click to browse"
  description="Supports images, PDFs, Figma files, and archives up to 50MB"
  formats={['JPG', 'PNG', 'PDF', 'FIG', 'ZIP']}
  onFilesAdd={addFiles}
/>
<FileUploadList
  files={files}
  onRemove={removeFile}
  onRetry={retryFile}
/>`}>
        <div className="space-y-4">
          {/* Drop zone */}
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            animate={{
              borderColor: isDragOver ? '#818cf8' : 'rgba(255,255,255,0.08)',
              backgroundColor: isDragOver ? 'rgba(129,140,248,0.05)' : 'rgba(0,0,0,0)',
              scale: isDragOver ? 1.01 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col items-center justify-center py-12 px-6 rounded-2xl border-2 border-dashed cursor-pointer group hover:border-primary/40 transition-colors"
          >
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            <motion.div animate={{ y: isDragOver ? -8 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <CloudUpload className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <p className="text-[14px] mb-1" style={{ fontWeight: 600 }}>
              {isDragOver ? 'Drop files to upload' : 'Drag & drop files here, or click to browse'}
            </p>
            <p className="text-[12px] text-muted-foreground">Supports images, PDFs, Figma files, and archives up to 50MB</p>
            <div className="flex items-center gap-3 mt-4">
              {['JPG', 'PNG', 'PDF', 'FIG', 'ZIP'].map(ext => (
                <span key={ext} className="px-2 py-0.5 rounded-md bg-muted text-[9px] text-muted-foreground" style={{ fontWeight: 600 }}>{ext}</span>
              ))}
            </div>
          </motion.div>

          {/* Stats row */}
          {files.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
              <span>{files.length} file{files.length > 1 ? 's' : ''} · {fmtSize(totalSize)}</span>
              {completedCount > 0 && <span className="flex items-center gap-1 text-emerald-500"><Check className="w-3 h-3" />{completedCount} completed</span>}
              {uploadingCount > 0 && (
                <span className="flex items-center gap-1 text-blue-500">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                  {uploadingCount} uploading
                </span>
              )}
              <button onClick={clearAll} className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer ml-auto flex items-center gap-1">
                <Trash2 className="w-3 h-3" />Clear all
              </button>
            </div>
          )}

          {/* File list */}
          <div className="space-y-1.5">
            <AnimatePresence>
              {files.map((file, i) => {
                const Icon = getFileIcon(file.type);
                const color = getFileColor(file.type);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-border/80 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] truncate" style={{ fontWeight: 500 }}>{file.name}</p>
                        {file.status === 'success' && <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                        {file.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{fmtSize(file.size)}</span>
                        {file.status === 'uploading' && (
                          <span className="text-[11px] text-blue-500" style={{ fontWeight: 500 }}>{Math.round(file.progress)}%</span>
                        )}
                        {file.status === 'error' && (
                          <span className="text-[11px] text-red-500">Upload failed</span>
                        )}
                      </div>
                      {file.status === 'uploading' && (
                        <div className="mt-1.5 w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary"
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.status === 'error' && (
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => retryFile(file.id)} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer" title="Retry">
                          <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                        </motion.button>
                      )}
                      {file.status === 'success' && (
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer" title="Preview">
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeFile(file.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 cursor-pointer" title="Remove">
                        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </Showcase>

      {/* Compact Upload Variants */}
      <Showcase title="Upload Variants" description="Different upload patterns for various use cases." delay={0.1} code={`// Inline attachment
<FileUpload variant="inline" />

// Avatar upload
<FileUpload variant="avatar" shape="circle" />

// Button-style upload
<FileUpload variant="button" />`}>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Inline attachment */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Inline Attachment</p>
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <p className="text-[13px] text-muted-foreground">Attach files to this message</p>
              <div className="flex flex-wrap gap-2">
                {['report.pdf', 'screenshot.png'].map(f => (
                  <motion.span key={f} layout className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-[11px]">
                    <Paperclip className="w-3 h-3 text-muted-foreground" />{f}
                    <X className="w-3 h-3 text-muted-foreground hover:text-destructive cursor-pointer" />
                  </motion.span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-[11px]"><Paperclip className="w-3 h-3" />Add attachment</Button>
            </div>
          </div>

          {/* Avatar upload */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Avatar Upload</p>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => avatarInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center cursor-pointer group overflow-hidden"
              >
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) setAvatarFile(e.target.files[0].name); }} />
                {avatarFile ? (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-[20px]" style={{ fontWeight: 700 }}>
                    {avatarFile.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <p className="text-[12px] text-muted-foreground">{avatarFile || 'Click to upload'}</p>
              <p className="text-[10px] text-muted-foreground/60">JPG, PNG, GIF up to 5MB</p>
            </div>
          </div>

          {/* Upload sources */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Upload Sources</p>
            <div className="space-y-2">
              {[
                { icon: FolderUp, label: 'Upload from computer', desc: 'Browse local files' },
                { icon: Link2, label: 'Import from URL', desc: 'Paste a file link' },
                { icon: HardDrive, label: 'Google Drive', desc: 'Connect your Drive' },
                { icon: CloudUpload, label: 'Dropbox', desc: 'Connect Dropbox' },
              ].map((src, i) => (
                <motion.button
                  key={src.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ x: 2 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-primary/3 transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <src.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[12px]" style={{ fontWeight: 500 }}>{src.label}</p>
                    <p className="text-[10px] text-muted-foreground">{src.desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </Showcase>

      {/* Validation */}
      <Showcase title="Validation & Constraints" description="File type restrictions, size limits, and validation feedback." delay={0.15} code={`<FileUpload
  accept=".jpg,.png,.webp"
  maxSize={5 * 1024 * 1024}
  maxFiles={5}
  onError={handleError}
/>`}>
        <div className="max-w-lg space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Max file size', value: '50 MB', icon: HardDrive },
              { label: 'Max files', value: '10', icon: File },
              { label: 'Accepted', value: '6 types', icon: Check },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card">
                <c.icon className="w-4 h-4 text-muted-foreground" />
                <div><p className="text-[10px] text-muted-foreground">{c.label}</p><p className="text-[13px]" style={{ fontWeight: 600 }}>{c.value}</p></div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { msg: 'File type not supported: .exe', type: 'error' as const },
              { msg: 'File exceeds 50MB limit: backup.tar.gz (128MB)', type: 'error' as const },
              { msg: 'Maximum 10 files allowed', type: 'warning' as const },
              { msg: 'design-system.fig uploaded successfully', type: 'success' as const },
            ].map((v, i) => (
              <motion.div
                key={v.msg}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] ${
                  v.type === 'error' ? 'bg-red-500/8 text-red-600 dark:text-red-400 border border-red-500/15' :
                  v.type === 'warning' ? 'bg-amber-500/8 text-amber-600 dark:text-amber-400 border border-amber-500/15' :
                  'bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                }`}
              >
                {v.type === 'error' && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                {v.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                {v.type === 'success' && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                {v.msg}
              </motion.div>
            ))}
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}