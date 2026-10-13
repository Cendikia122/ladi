"use client";
import { useState, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "<p>Tulis kode HTML atau teks langsung di sini...</p>",
  label = "Isi Konten (Editor Kode HTML Langsung)",
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "code"
                ? "bg-white text-[#1853a7] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            💻 Edit HTML
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-white text-[#1853a7] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👁️ Pratinjau Tampilan
          </button>
        </div>
      </div>

      {/* Toolbar Tombol Cepat Tag HTML */}
      {activeTab === "code" && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">
            Sisipkan Tag:
          </span>
          <button
            type="button"
            onClick={() => insertTag("<p>", "</p>")}
            title="Paragraf"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;p&gt; Paragraf
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h2>", "</h2>")}
            title="Sub-judul Besar"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;h2&gt; Sub-judul
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h3>", "</h3>")}
            title="Sub-judul Kecil"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;h3&gt; Judul Kecil
          </button>
          <button
            type="button"
            onClick={() => insertTag("<strong>", "</strong>")}
            title="Teks Tebal"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;strong&gt; Tebal
          </button>
          <button
            type="button"
            onClick={() => insertTag("<em>", "</em>")}
            title="Teks Miring"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;em&gt; Miring
          </button>
          <button
            type="button"
            onClick={() => insertTag("<ul>\n  <li>", "</li>\n  <li>Poin kedua</li>\n</ul>")}
            title="Daftar Poin"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;ul&gt;&lt;li&gt; List
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote class="border-l-4 border-[#1853a7] pl-4 italic my-3 text-slate-600">\n  ', "\n</blockquote>")}
            title="Kutipan"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;quote&gt; Kutipan
          </button>
          <button
            type="button"
            onClick={() => insertTag("<br/>\n")}
            title="Ganti Baris"
            className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-mono text-[11px] font-bold"
          >
            &lt;br/&gt; Baris Baru
          </button>
          <button
            type="button"
            onClick={() => insertTag('<a href="https://wa.me/6282112477119" target="_blank" rel="noopener noreferrer" class="text-[#1853a7] font-bold underline hover:text-[#0f3d7d]">', "</a>")}
            title="Tautan / Link WA"
            className="px-2 py-1 rounded-md bg-blue-50 border border-blue-300 hover:bg-blue-100 text-[#1853a7] font-mono text-[11px] font-bold"
          >
            &lt;a&gt; Link WA
          </button>
        </div>
      )}

      {/* Textarea Kode HTML Langsung */}
      {activeTab === "code" ? (
        <div className="space-y-1">
          <textarea
            ref={textareaRef}
            rows={14}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#1853a7] focus:ring-1 focus:ring-[#1853a7] bg-[#f8fafc] text-slate-900 leading-relaxed transition-all resize-y min-h-[220px]"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>
              💡 Edit langsung kode HTML. Tag tidak akan diubah atau dihapus otomatis.
            </span>
            <span>{value ? `${value.length} karakter` : "Kosong"}</span>
          </div>
        </div>
      ) : (
        /* Pratinjau Tampilan Web Render Langsung */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 min-h-[220px] shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-3 mb-3 border-b border-slate-100">
            Pratinjau Hasil Tampilan di Halaman Web
          </div>
          {value ? (
            <div
              className="text-slate-800 text-sm leading-relaxed space-y-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1853a7] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_a]:text-[#1853a7] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="text-slate-400 text-xs italic py-8 text-center">
              Belum ada teks atau kode HTML untuk dipratinjau.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
