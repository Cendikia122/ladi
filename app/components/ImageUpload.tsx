"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { compressImageFile } from "@/app/lib/imageCompress";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Foto / Thumbnail",
  helperText = "Format JPG, PNG, WEBP (Otomatis Dioptimasi & Ringan)",
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUrlMode, setIsUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      // 1. Kompresi gambar di sisi klien menggunakan HTML5 Canvas
      // Mengubah foto besar (3MB-10MB) menjadi web-ready (~50-90 KB)
      const compressedDataUri = await compressImageFile(file, 1200, 800, 0.82);

      if (compressedDataUri) {
        onChange(compressedDataUri);
      } else {
        setError("Gagal memproses gambar. Coba format lain.");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat memproses foto");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  const getEstimatedSize = (val?: string) => {
    if (!val) return "";
    if (val.startsWith("data:")) {
      const kb = Math.round((val.length * 0.75) / 1024);
      return `~${kb} KB (Ringan)`;
    }
    return "URL Eksternal";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] font-bold text-[#1853a7] hover:underline"
        >
          {isUrlMode ? "← Upload dari Laptop / HP" : "Gunakan URL Gambar →"}
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
          {error}
        </div>
      )}

      {isUrlMode ? (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://example.com/foto-anda.jpg"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
          />
          <p className="text-[11px] text-slate-400">
            Tempel link foto langsung dari internet (Unsplash, Cloudinary, atau web Anda).
          </p>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          />

          {value ? (
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <Image
                  src={value}
                  alt="Preview Foto"
                  fill
                  className="object-cover"
                  unoptimized={value.startsWith("data:") || value.startsWith("http")}
                />
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                  Foto Terpasang
                </span>
                <span className="text-[11px] text-emerald-600 block font-medium truncate max-w-xs">
                  ✓ {getEstimatedSize(value)} · Aman Disimpan
                </span>

                <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                  <label
                    htmlFor={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
                    className="cursor-pointer px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
                  >
                    {loading ? "Mengompresi..." : "Ganti Foto"}
                  </label>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                loading
                  ? "border-[#1853a7] bg-blue-50/50"
                  : "border-slate-300 hover:border-[#1853a7] hover:bg-blue-50/20 bg-[#f8fafc]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1853a7] flex items-center justify-center mb-2 text-lg">
                {loading ? "⏳" : "📷"}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {loading ? "Sedang Mengompresi & Memproses..." : "Klik untuk Pilih & Upload Foto dari Laptop"}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">{helperText}</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
