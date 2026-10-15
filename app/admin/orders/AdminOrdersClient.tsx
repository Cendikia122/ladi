"use client";

import { useState } from "react";
import Link from "next/link";
import { OrderItem } from "@/app/lib/storage";
import { downloadInvoicePdf, downloadProofPdf } from "@/app/lib/invoicePdf";

interface AdminOrdersClientProps {
  initialOrders: OrderItem[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedProofOrder, setSelectedProofOrder] = useState<OrderItem | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  // Perhitungan KPI
  const totalOrders = orders.length;
  const waitingOrders = orders.filter((o) => o.payment_status === "waiting_verification").length;
  const paidOrders = orders.filter((o) => o.payment_status === "paid").length;
  const unpaidOrders = orders.filter((o) => o.payment_status === "unpaid").length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + (o.package_price || 0), 0);

  const formattedRevenue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  // Filter & Search
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filter === "waiting" && order.payment_status !== "waiting_verification") return false;
    if (filter === "unpaid" && order.payment_status !== "unpaid") return false;
    if (filter === "paid" && order.payment_status !== "paid") return false;
    if (filter === "completed" && order.order_status !== "completed") return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = order.order_number.toLowerCase().includes(q);
      const matchCustomer = order.customer_name.toLowerCase().includes(q);
      const matchBusiness = order.business_name.toLowerCase().includes(q);
      const matchPhone = order.customer_phone.includes(q);
      const matchPackage = order.package_name.toLowerCase().includes(q);
      return matchNumber || matchCustomer || matchBusiness || matchPhone || matchPackage;
    }

    return true;
  });

  const handleDownloadPdf = async (order: OrderItem) => {
    setDownloadingPdf(order.order_number);
    try {
      await downloadInvoicePdf(order, { includeProof: true });
    } catch (err: any) {
      alert("Gagal mengunduh PDF: " + (err?.message || "Terjadi kendala."));
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleUpdateStatus = async (
    orderNumber: string,
    field: "payment_status" | "order_status",
    value: string
  ) => {
    setIsUpdating(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Gagal mengubah status.");
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.order_number === orderNumber ? data.order : o))
      );
    } catch (err: any) {
      alert("Terjadi kendala jaringan.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (orderNumber: string) => {
    if (!confirm(`Yakin ingin menghapus pesanan #${orderNumber}? Data tidak dapat dikembalikan.`)) {
      return;
    }

    setIsUpdating(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Gagal menghapus pesanan.");
        return;
      }

      setOrders((prev) => prev.filter((o) => o.order_number !== orderNumber));
    } catch {
      alert("Terjadi kendala saat menghapus pesanan.");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Pesanan Masuk
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalOrders}</div>
          <span className="text-[11px] text-slate-500">Semua riwayat pemesanan</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block flex items-center justify-between">
            <span>Butuh Verifikasi</span>
            {waitingOrders > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">{waitingOrders}</div>
          <span className="text-[11px] text-amber-700">Sudah upload bukti bayar</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Pesanan Terkonfirmasi
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">{paidOrders}</div>
          <span className="text-[11px] text-slate-500">Lunas & siap/sedang dikerjakan</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#1853a7] uppercase tracking-wider block">
            Total Omzet Lunas
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1853a7] truncate">
            {formattedRevenue}
          </div>
          <span className="text-[11px] text-slate-500">Akumulasi uang masuk</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-[#0f172a] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({totalOrders})
          </button>
          <button
            type="button"
            onClick={() => setFilter("waiting")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "waiting"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Menunggu Cek ({waitingOrders})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unpaid")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "unpaid"
                ? "bg-orange-600 text-white"
                : "bg-orange-50 text-orange-700 hover:bg-orange-100"
            }`}
          >
            Belum Bayar ({unpaidOrders})
          </button>
          <button
            type="button"
            onClick={() => setFilter("paid")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "paid"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Lunas ({paidOrders})
          </button>
        </div>

        {/* Search */}
        <div className="relative md:w-72">
          <input
            type="text"
            placeholder="Cari nama, order #, WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Tabel Pesanan */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <span className="text-3xl">📭</span>
            <div className="text-sm font-bold text-slate-700">Tidak ada pesanan ditemukan</div>
            <p className="text-xs text-slate-400">
              Belum ada pesanan dengan status atau kata kunci yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Invoice & Waktu</th>
                  <th className="px-5 py-3.5">Klien & Usaha</th>
                  <th className="px-5 py-3.5">Paket & Biaya</th>
                  <th className="px-5 py-3.5">Status Pembayaran</th>
                  <th className="px-5 py-3.5">Status Pengerjaan</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const formattedPrice = new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(order.package_price);

                  return (
                    <tr
                      key={order.order_number}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Invoice & Tanggal */}
                      <td className="px-5 py-4 align-top space-y-1">
                        <Link
                          href={`/order/${order.order_number}`}
                          target="_blank"
                          className="font-mono font-black text-slate-900 hover:text-[#fa824b] transition-colors block text-[13px]"
                        >
                          #{order.order_number}
                        </Link>
                        <div className="text-[11px] text-slate-400">
                          {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                          {order.payment_method}
                        </span>
                      </td>

                      {/* Detail Klien */}
                      <td className="px-5 py-4 align-top space-y-1">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {order.customer_name}
                        </div>
                        <div className="text-slate-600 font-medium">
                          🏢 {order.business_name} ({order.business_category || "Lainnya"})
                        </div>
                        {order.domain_requested && (
                          <div className="text-blue-600 font-mono text-[11px]">
                            🌐 {order.domain_requested}
                          </div>
                        )}
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/${order.customer_phone}?text=Halo+Kak+${encodeURIComponent(order.customer_name)}+dari+${encodeURIComponent(order.business_name)}%2C+saya+dari+Ladi+terkait+pesanan+${order.order_number}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors"
                          >
                            <span>WhatsApp: {order.customer_phone}</span>
                            <span>💬</span>
                          </a>
                        </div>
                      </td>

                      {/* Paket & Biaya */}
                      <td className="px-5 py-4 align-top space-y-1.5 max-w-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            order.order_type === "pecahan"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.order_type === "pecahan" ? "🧩 Pecahan LEGO" : "📦 Paketan"}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{order.package_name}</span>
                        </div>
                        <div className="text-sm font-black text-[#1853a7]">{formattedPrice}</div>

                        {/* Rincian Template & Addons */}
                        {(order.template_name || order.domain_choice || order.hosting_duration || order.addons) && (
                          <div className="pt-1.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                            {order.template_name && (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span>🎨 {order.template_name}</span>
                                {order.template_url && (
                                  <a
                                    href={order.template_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-bold text-[10px]"
                                  >
                                    Demo ↗
                                  </a>
                                )}
                              </div>
                            )}
                            {order.domain_choice && (
                              <div>🌐 {order.domain_choice}</div>
                            )}
                            {order.hosting_duration && (
                              <div>☁️ {order.hosting_duration}</div>
                            )}
                            {order.addons && (
                              <div className="text-emerald-700 font-medium">
                                ➕ Addons: {(() => {
                                  try {
                                    const p = JSON.parse(order.addons);
                                    return Array.isArray(p) ? p.join(", ") : String(p);
                                  } catch {
                                    return order.addons;
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status Pembayaran */}
                      <td className="px-5 py-4 align-top space-y-2">
                        <select
                          disabled={isUpdating === order.order_number}
                          value={order.payment_status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              order.order_number,
                              "payment_status",
                              e.target.value
                            )
                          }
                          className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            order.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : order.payment_status === "waiting_verification"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : order.payment_status === "cancelled"
                              ? "bg-slate-100 text-slate-600 border-slate-300"
                              : "bg-orange-50 text-[#fa824b] border-orange-300"
                          }`}
                        >
                          <option value="unpaid">⏳ Belum Bayar (Unpaid)</option>
                          <option value="waiting_verification">
                            ⚠️ Menunggu Cek Bukti
                          </option>
                          <option value="paid">✓ Lunas (Paid)</option>
                          <option value="cancelled">✕ Dibatalkan</option>
                        </select>

                        {order.payment_proof && (
                          <button
                            type="button"
                            onClick={() => setSelectedProofOrder(order)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <span>📷 Lihat Bukti Transfer</span>
                          </button>
                        )}
                      </td>

                      {/* Status Pengerjaan Proyek */}
                      <td className="px-5 py-4 align-top space-y-1">
                        <select
                          disabled={isUpdating === order.order_number}
                          value={order.order_status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              order.order_number,
                              "order_status",
                              e.target.value
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-white text-slate-700 cursor-pointer"
                        >
                          <option value="new">🆕 Baru Masuk</option>
                          <option value="in_progress">⚙️ Sedang Dikerjakan</option>
                          <option value="review">👀 Masa Review Klien</option>
                          <option value="completed">🎉 Selesai & Serah Terima</option>
                        </select>
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4 align-top text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(order)}
                          disabled={downloadingPdf === order.order_number}
                          className="px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#fa824b] font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-orange-200"
                          title="Unduh Bukti Invoice Resmi sebagai file PDF"
                        >
                          {downloadingPdf === order.order_number ? (
                            <>
                              <span className="w-3 h-3 rounded-full border-2 border-[#fa824b] border-t-transparent animate-spin"></span>
                              <span>Proses...</span>
                            </>
                          ) : (
                            <>
                              <span>📄</span>
                              <span>Unduh PDF</span>
                            </>
                          )}
                        </button>
                        <Link
                          href={`/order/${order.order_number}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-block font-medium text-[11px] transition-colors"
                          title="Buka Invoice Digital"
                        >
                          Buka ↗
                        </Link>
                        <button
                          type="button"
                          disabled={isUpdating === order.order_number}
                          onClick={() => handleDelete(order.order_number)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium text-[11px] transition-colors"
                          title="Hapus Pesanan"
                        >
                          Hapus 🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Preview Bukti Transfer */}
      {selectedProofOrder && selectedProofOrder.payment_proof && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProofOrder(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Bukti Transfer Pembayaran Klien
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Invoice #{selectedProofOrder.order_number} · {selectedProofOrder.customer_name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProofOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProofOrder.payment_proof}
                alt={`Bukti Transfer #${selectedProofOrder.order_number}`}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadProofPdf(selectedProofOrder)}
                  className="px-3 py-1.5 rounded-xl bg-[#00a5cf] hover:bg-[#008cb0] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Unduh Bukti Transfer ini sebagai dokumen PDF resmi"
                >
                  <span>📥</span>
                  <span>Unduh Bukti PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(selectedProofOrder)}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#fa824b] font-bold text-xs inline-flex items-center gap-1.5 transition-colors border border-orange-200"
                  title="Unduh Invoice Lengkap + Lampiran Bukti Transfer"
                >
                  <span>📄</span>
                  <span>Invoice Lengkap PDF</span>
                </button>
                <a
                  href={selectedProofOrder.payment_proof}
                  download={`Bukti-Transfer-${selectedProofOrder.order_number}.jpg`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                  title="Simpan file gambar asli"
                >
                  <span>🖼️</span>
                  <span>Gambar Asli</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProofOrder(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
