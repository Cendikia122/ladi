"use client";

import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import { compressImageFile } from "@/app/lib/imageCompress";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi konten secara lengkap dan rapi di sini...",
  label = "Isi Konten (Visual Rich Text Editor)",
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "code" | "preview">("visual");
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isInternalChange = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inisialisasi Quill sekali saat komponen mount di browser
  useEffect(() => {
    let isMounted = true;

    async function initQuill() {
      if (!containerRef.current || quillRef.current) return;

      try {
        const { default: Quill } = await import("quill");
        if (!isMounted || !containerRef.current) return;

        // Bersihkan kontainer untuk mencegah duplikasi toolbar saat hot-reload
        containerRef.current.innerHTML = "";

        const editorDiv = document.createElement("div");
        containerRef.current.appendChild(editorDiv);

        const quill = new Quill(editorDiv, {
          theme: "snow",
          placeholder,
          modules: {
            toolbar: {
              container: [
                [{ header: [2, 3, 4, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["blockquote", "code-block"],
                ["link", "image"],
                ["clean"],
              ],
              handlers: {
                // Handler kustom untuk kompresi gambar otomatis agar tidak melebihi batas 4.5MB Vercel
                image: function () {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.click();

                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;

                    try {
                      // Kompres gambar ke ukuran hemat (~50-80KB)
                      const compressedDataUrl = await compressImageFile(file, 1000, 700, 0.75);
                      if (!compressedDataUrl) return;

                      const range = quill.getSelection(true);
                      quill.insertEmbed(range.index, "image", compressedDataUrl);
                      quill.setSelection(range.index + 1);
                    } catch (e) {
                      console.error("Gagal menyisipkan gambar:", e);
                    }
                  };
                },
              },
            },
          },
        });

        // Setel nilai awal
        if (value) {
          quill.root.innerHTML = value;
        }

        // Listener perubahan teks dari Quill
        quill.on("text-change", () => {
          isInternalChange.current = true;
          const html = quill.root.innerHTML;
          const cleanHtml = html === "<p><br></p>" ? "" : html;
          onChange(cleanHtml);
          setTimeout(() => {
            isInternalChange.current = false;
          }, 0);
        });

        quillRef.current = quill;
      } catch (err) {
        console.error("Gagal memuat editor Quill:", err);
      }
    }

    initQuill();

    return () => {
      isMounted = false;
      quillRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sinkronisasi nilai eksternal (misal data artikel yang baru selesai di-fetch dari API)
  useEffect(() => {
    if (quillRef.current && !isInternalChange.current) {
      const currentHtml = quillRef.current.root.innerHTML;
      const cleanCurrent = currentHtml === "<p><br></p>" ? "" : currentHtml;
      if (value !== cleanCurrent) {
        quillRef.current.root.innerHTML = value || "";
      }
    }
  }, [value]);

  // Handler pergantian tab
  const handleTabChange = (target: "visual" | "code" | "preview") => {
    if (target === activeTab) return;

    if (activeTab === "visual" && quillRef.current) {
      const html = quillRef.current.root.innerHTML;
      const cleanHtml = html === "<p><br></p>" ? "" : html;
      onChange(cleanHtml);
    } else if (target === "visual" && quillRef.current) {
      quillRef.current.root.innerHTML = value || "";
    }

    setActiveTab(target);
  };

  // Helper untuk tombol cepat di mode HTML langsung
  const insertTag = (openTag: string, closeTag = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + openTag + closeTag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = openTag + selectedText + closeTag;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText ? start + replacement.length : start + openTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabChange("visual")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "visual"
                ? "bg-white text-[#1853a7] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ✍️ Editor Visual (Quill)
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("code")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-white text-[#1853a7] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            💻 Edit HTML
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("preview")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-white text-[#1853a7] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👁️ Pratinjau
          </button>
        </div>
      </div>

      {/* Mode 1: Editor Visual (Quill) — Tetap terpasang di DOM agar tidak kehilangan state */}
      <div className={activeTab === "visual" ? "block" : "hidden"}>
        <div className="rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-xs focus-within:border-[#1853a7] focus-within:ring-1 focus-within:ring-[#1853a7] transition-all">
          <div ref={containerRef} className="quill-wrapper" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
          <span>
            💡 Ketik dan format kalimat langsung seperti di Word/Docs tanpa perlu menulis tag HTML manual.
          </span>
          <span>{value ? `${value.length} karakter` : "Kosong"}</span>
        </div>
      </div>

      {/* Mode 2: Edit Kode HTML Langsung */}
      <div className={activeTab === "code" ? "block space-y-2" : "hidden"}>
        {/* Toolbar Tombol Cepat Tag HTML */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">
            Sisipkan Tag:
          </span>
          <button
            type="button"
            onClick={() => insertTag("<p>", "</p>")}
            title="Paragraf"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;p&gt; Paragraf
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h2>", "</h2>")}
            title="Sub-judul Besar"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;h2&gt; Sub-judul
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h3>", "</h3>")}
            title="Sub-judul Kecil"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;h3&gt; Judul Kecil
          </button>
          <button
            type="button"
            onClick={() => insertTag("<strong>", "</strong>")}
            title="Teks Tebal"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;strong&gt; Tebal
          </button>
          <button
            type="button"
            onClick={() => insertTag("<em>", "</em>")}
            title="Teks Miring"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;em&gt; Miring
          </button>
          <button
            type="button"
            onClick={() => insertTag("<ul>\n  <li>", "</li>\n  <li>Poin kedua</li>\n</ul>")}
            title="Daftar Poin"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;ul&gt;&lt;li&gt; List
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote class="border-l-4 border-[#1853a7] pl-4 italic my-3 text-slate-600">\n  ', "\n</blockquote>")}
            title="Kutipan"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;quote&gt; Kutipan
          </button>
          <button
            type="button"
            onClick={() => insertTag("<br/>\n")}
            title="Ganti Baris"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;br/&gt; Baris Baru
          </button>
          <button
            type="button"
            onClick={() => insertTag('<a href="https://wa.me/6282112477119" target="_blank" rel="noopener noreferrer" class="text-[#1853a7] font-bold underline hover:text-[#0f3d7d]">', "</a>")}
            title="Tautan / Link WA"
            className="px-2 py-1 rounded-md bg-blue-50 border border-blue-300 hover:bg-blue-100 text-[#1853a7] font-mono text-[11px] font-bold cursor-pointer"
          >
            &lt;a&gt; Link WA
          </button>
        </div>

        <textarea
          ref={textareaRef}
          rows={14}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Tulis kode HTML di sini...</p>"
          spellCheck={false}
          className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#1853a7] focus:ring-1 focus:ring-[#1853a7] bg-[#f8fafc] text-slate-900 leading-relaxed transition-all resize-y min-h-[240px]"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>
            💡 Mode kode HTML: Anda bisa menambahkan tag khusus atau memeriksa struktur HTML artikel.
          </span>
          <span>{value ? `${value.length} karakter` : "Kosong"}</span>
        </div>
      </div>

      {/* Mode 3: Pratinjau Tampilan */}
      <div className={activeTab === "preview" ? "block" : "hidden"}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 min-h-[240px] shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-3 mb-3 border-b border-slate-100">
            Pratinjau Hasil Tampilan di Halaman Web
          </div>
          {value ? (
            <div
              className="text-slate-800 text-sm leading-relaxed space-y-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1853a7] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_a]:text-[#1853a7] [&_a]:underline [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-3"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="text-slate-400 text-xs italic py-10 text-center">
              Belum ada teks atau konten untuk dipratinjau.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
