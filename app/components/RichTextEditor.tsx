"use client";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi konten secara lengkap di sini...",
  label = "Isi Konten (Rich Text Editor)",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const isUpdatingFromQuill = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function initQuill() {
      if (editorRef.current && !quillInstance.current) {
        const { default: Quill } = await import("quill");
        if (!isMounted || !editorRef.current) return;

        const quill = new Quill(editorRef.current, {
          theme: "snow",
          placeholder,
          modules: {
            toolbar: [
              [{ header: [2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote", "code-block"],
              ["link", "image"],
              ["clean"],
            ],
          },
        });

        // Set initial content
        if (value) {
          quill.clipboard.dangerouslyPasteHTML(value);
        }

        quill.on("text-change", () => {
          isUpdatingFromQuill.current = true;
          const html = quill.root.innerHTML;
          onChange(html === "<p><br></p>" ? "" : html);
          setTimeout(() => {
            isUpdatingFromQuill.current = false;
          }, 0);
        });

        quillInstance.current = quill;
      }
    }

    initQuill();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update quill when value changes externally (not triggered by quill itself)
  useEffect(() => {
    if (quillInstance.current && !isUpdatingFromQuill.current) {
      const currentHtml = quillInstance.current.root.innerHTML;
      if (value !== currentHtml && value !== (currentHtml === "<p><br></p>" ? "" : currentHtml)) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(value || "");
      }
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className="text-[11px] font-bold text-[#1853a7] hover:underline"
        >
          {isHtmlMode ? "👁️ Tampilkan Visual Editor (Quill)" : "💻 Edit Kode HTML Langsung"}
        </button>
      </div>

      {isHtmlMode ? (
        <div className="space-y-1">
          <textarea
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<p>Tulis kode HTML di sini...</p>"
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#1853a7] bg-[#f8fafc] text-slate-800 leading-relaxed"
          />
          <span className="text-[11px] text-slate-400 block">
            Mode kode HTML: Anda bisa menambahkan tag khusus, iframe video, atau custom styling.
          </span>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-sm focus-within:border-[#1853a7] transition-all">
          <div ref={editorRef} className="min-h-[280px] text-sm text-slate-800" />
        </div>
      )}
    </div>
  );
}
