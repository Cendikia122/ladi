import { jsPDF } from "jspdf";
import { OrderItem } from "./storage";

/**
 * Format currency to IDR Rupiah
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to standard Indonesian format
 */
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  } catch {
    return String(dateStr);
  }
}

/**
 * Helper to safely get image dimensions & data URL in browser
 */
async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number; dataUrl: string } | null> {
  if (!src) return null;
  if (typeof window === "undefined") {
    return { width: 800, height: 600, dataUrl: src };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (src.startsWith("data:")) {
        resolve({
          width: img.naturalWidth || 800,
          height: img.naturalHeight || 600,
          dataUrl: src,
        });
      } else {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight,
              dataUrl: canvas.toDataURL("image/jpeg", 0.9),
            });
            return;
          }
        } catch {
          // fallback
        }
        resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600, dataUrl: src });
      }
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Build jsPDF instance for an Order
 */
export async function createInvoicePdf(
  order: OrderItem,
  options: { includeProof?: boolean } = { includeProof: true }
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm

  // ==========================================
  // PAGE 1: OFFICIAL INVOICE
  // ==========================================

  // 1. Top Accent Bar (Gradient look: Navy & Orange)
  doc.setFillColor(15, 23, 42); // Navy
  doc.rect(0, 0, pageWidth, 4, "F");
  doc.setFillColor(250, 130, 75); // Ladi Orange
  doc.rect(margin, 0, 50, 4, "F");

  // 2. Company Brand / Header
  let y = 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text("LADI", margin, y);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(250, 130, 75);
  doc.text("LAYANAN DIGITAL INDONESIA", margin + 24, y - 2);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Jasa Pembuatan Website & Solusi Bisnis Digital", margin, y);
  y += 4.5;
  doc.text("Website: https://www.layanandigital.id  |  WhatsApp: 0821-1247-7119", margin, y);

  // 3. Invoice Header (Right aligned)
  const headerRightX = pageWidth - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("INVOICE RESMI", headerRightX, 16, { align: "right" });

  doc.setFontSize(11);
  doc.setTextColor(250, 130, 75);
  doc.text(`#${order.order_number}`, headerRightX, 22, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Tanggal: ${formatDate(order.created_at)}`, headerRightX, 27, { align: "right" });

  // 4. Status Badge
  const statusStr = (order.payment_status || "unpaid").toLowerCase();
  let badgeText = "BELUM BAYAR (UNPAID)";
  let badgeBg = [254, 242, 242]; // red-50
  let badgeBorder = [248, 113, 113]; // red-400
  let badgeTextCol = [185, 28, 28]; // red-700

  if (statusStr === "paid") {
    badgeText = "LUNAS / TERVERIFIKASI";
    badgeBg = [236, 253, 245]; // emerald-50
    badgeBorder = [52, 211, 153]; // emerald-400
    badgeTextCol = [4, 120, 87]; // emerald-700
  } else if (statusStr === "waiting_verification") {
    badgeText = "MENUNGGU VERIFIKASI BUKTI";
    badgeBg = [254, 252, 232]; // amber-50
    badgeBorder = [251, 191, 36]; // amber-400
    badgeTextCol = [180, 83, 9]; // amber-700
  } else if (statusStr === "cancelled") {
    badgeText = "DIBATALKAN";
    badgeBg = [241, 245, 249]; // slate-100
    badgeBorder = [148, 163, 184]; // slate-400
    badgeTextCol = [71, 85, 105]; // slate-600
  }

  doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
  doc.setDrawColor(badgeBorder[0], badgeBorder[1], badgeBorder[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(headerRightX - 60, 31, 60, 6.5, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(badgeTextCol[0], badgeTextCol[1], badgeTextCol[2]);
  doc.text(badgeText, headerRightX - 30, 35.2, { align: "center" });

  // 5. Divider Line
  y = 41;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  // 6. Two-Column Billing Info (Customer vs Publisher)
  y += 5;
  const colWidth = (contentWidth - 6) / 2; // ~88 mm each
  const boxHeight = 44;

  // -- Left Box: Customer Info
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, colWidth, boxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("TAGIHAN KEPADA (KLIEN):", margin + 4, y + 5);

  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // Navy
  doc.text(order.customer_name || "Pelanggan Ladi", margin + 4, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Usaha: ${order.business_name || "-"} (${order.business_category || "Bisnis"})`, margin + 4, y + 17);
  doc.text(`WhatsApp: ${order.customer_phone || "-"}`, margin + 4, y + 22.5);
  if (order.customer_email) {
    doc.text(`Email: ${order.customer_email}`, margin + 4, y + 28);
  } else {
    doc.text(`Email: -`, margin + 4, y + 28);
  }
  const domReq = order.domain_requested || order.domain_choice;
  if (domReq) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 83, 167); // blue-700
    doc.text(`Domain: ${domReq}`, margin + 4, y + 33.5);
  }

  // -- Right Box: Publisher & Payment Info
  const rightColX = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightColX, y, colWidth, boxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("PENERBIT TAGIHAN & PEMBAYARAN:", rightColX + 4, y + 5);

  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Ladi (Layanan Digital)", rightColX + 4, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Finance & Konfirmasi: 0821-1247-7119", rightColX + 4, y + 17);

  const paymentDisplay =
    order.payment_method === "GOPAY" || !order.payment_method
      ? "GoPay (No: 0821-1247-7119)"
      : order.payment_method === "QRIS"
      ? "QRIS Instan Resmi"
      : order.payment_method;
  doc.text(`Metode Bayar: ${paymentDisplay}`, rightColX + 4, y + 22.5);
  doc.text(`Status: ${badgeText}`, rightColX + 4, y + 28);
  doc.text(`Waktu Lunas: ${order.paid_at ? formatDate(order.paid_at) : "Menunggu Konfirmasi"}`, rightColX + 4, y + 33.5);

  // 7. Table of Items
  y += boxHeight + 7;

  // Table Header
  doc.setFillColor(15, 23, 42); // Dark Navy header
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("NO", margin + 3, y + 5.2);
  doc.text("RINCIAN LAYANAN & SPESIFIKASI", margin + 14, y + 5.2);
  doc.text("TIPE", margin + 110, y + 5.2);
  doc.text("TOTAL BIAYA", headerRightX - 3, y + 5.2, { align: "right" });

  // Table Body Item
  y += 8;
  const itemStartY = y;
  const formattedPrice = formatRupiah(order.package_price || 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1", margin + 4, y + 6);
  doc.text(order.package_name || "Pembuatan Website Ladi", margin + 14, y + 6);

  // Item Sub-details
  let subY = y + 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  if (order.template_name) {
    doc.text(`• Template Pilihan: ${order.template_name} (${order.template_tech || "Web Framework"})`, margin + 14, subY);
    subY += 4.5;
  }
  if (order.domain_choice) {
    doc.text(`• Pilihan Domain: ${order.domain_choice}`, margin + 14, subY);
    subY += 4.5;
  }
  if (order.hosting_duration) {
    doc.text(`• Durasi Cloud Hosting: ${order.hosting_duration}`, margin + 14, subY);
    subY += 4.5;
  }

  // Parse addons
  if (order.addons) {
    try {
      const parsed = JSON.parse(order.addons);
      const addonList = Array.isArray(parsed) ? parsed : [String(parsed)];
      if (addonList.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129); // emerald
        doc.text(`• Addons Ekstra: ${addonList.join(", ")}`, margin + 14, subY);
        subY += 4.5;
      }
    } catch {
      doc.text(`• Addons: ${order.addons}`, margin + 14, subY);
      subY += 4.5;
    }
  }

  if (order.notes) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`• Catatan Klien: "${order.notes}"`, margin + 14, subY);
    subY += 4.5;
  }

  // Type & Price columns
  const typeText = order.order_type === "pecahan" ? "Custom LEGO" : "Paket All-in";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(typeText, margin + 110, y + 6);

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(formattedPrice, headerRightX - 3, y + 6, { align: "right" });

  const itemHeight = Math.max(subY - y + 2, 24);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, itemStartY, contentWidth, itemHeight);

  y = itemStartY + itemHeight;

  // 8. Total Summary Box (Bottom Right)
  const totalBoxWidth = 75;
  const totalBoxX = headerRightX - totalBoxWidth;
  const totalBoxY = y + 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalBoxX, totalBoxY, totalBoxWidth, 22, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", totalBoxX + 4, totalBoxY + 5.5);
  doc.text(formattedPrice, headerRightX - 4, totalBoxY + 5.5, { align: "right" });

  doc.text("Biaya Admin / Sistem:", totalBoxX + 4, totalBoxY + 10.5);
  doc.setTextColor(16, 185, 129);
  doc.text("Rp 0 (Gratis)", headerRightX - 4, totalBoxY + 10.5, { align: "right" });

  doc.setDrawColor(203, 213, 225);
  doc.line(totalBoxX + 4, totalBoxY + 13, headerRightX - 4, totalBoxY + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL AKHIR:", totalBoxX + 4, totalBoxY + 18.5);
  doc.setFontSize(12);
  doc.setTextColor(250, 130, 75);
  doc.text(formattedPrice, headerRightX - 4, totalBoxY + 18.5, { align: "right" });

  // 9. Payment Information Box (Bottom Left)
  const payInfoWidth = totalBoxX - margin - 5;
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, totalBoxY, payInfoWidth, 22, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text("INFO PEMBAYARAN RESMI:", margin + 4, totalBoxY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Tujuan Transfer: E-Wallet GoPay", margin + 4, totalBoxY + 10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 165, 207);
  doc.text("Nomor: 0821-1247-7119 (a/n Ladi Layanan Digital)", margin + 4, totalBoxY + 15);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Verifikasi otomatis diproses tim finance kami.", margin + 4, totalBoxY + 19);

  // 10. Terms & Guarantees Box
  y = totalBoxY + 27;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 25, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("KETENTUAN & JAMINAN LAYANAN LADI:", margin + 4, y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "1. Pengerjaan proyek dimulai maksimal 1x24 jam setelah pembayaran diverifikasi oleh tim Ladi.",
    margin + 4,
    y + 9
  );
  doc.text(
    "2. Klien berhak atas revisi minor tampilan dan garansi pemeliharaan teknis / bug fixing 30 hari pasca serah terima.",
    margin + 4,
    y + 13
  );
  doc.text(
    "3. Seluruh source code, domain, dan akses akun hosting diserahkan penuh secara transparan kepada klien.",
    margin + 4,
    y + 17
  );
  doc.text(
    "4. Untuk bantuan teknis atau percepatan proses pengerjaan, hubungi Customer Care WhatsApp: 0821-1247-7119.",
    margin + 4,
    y + 21
  );

  // 11. Official Footer & Verification Stamp
  y = pageHeight - 14;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y - 2, pageWidth - margin, y - 2);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Dokumen digital resmi diterbitkan oleh PT / Tim Ladi (Layanan Digital). Keabsahan dapat diverifikasi di sistem online.",
    margin,
    y + 2
  );
  doc.text(
    `Halaman 1 ${options.includeProof && order.payment_proof ? "dari 2 (Dilengkapi Lampiran Bukti)" : "dari 1"}`,
    pageWidth - margin,
    y + 2,
    { align: "right" }
  );

  // ==========================================
  // PAGE 2: ATTACHMENT / PAYMENT PROOF (IF EXISTS)
  // ==========================================
  if (options.includeProof && order.payment_proof) {
    const imgInfo = await getImageDimensions(order.payment_proof);
    if (imgInfo) {
      doc.addPage();

      // Top Accent
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 4, "F");
      doc.setFillColor(250, 130, 75);
      doc.rect(margin, 0, 50, 4, "F");

      // Header Page 2
      let p2Y = 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("LAMPIRAN BUKTI TRANSFER PEMBAYARAN", margin, p2Y);

      p2Y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Bukti transaksi resmi yang diunggah klien untuk Invoice #${order.order_number}`,
        margin,
        p2Y
      );

      // Meta Box
      p2Y += 6;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, p2Y, contentWidth, 16, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Pemesan: ${order.customer_name} (${order.customer_phone})`, margin + 4, p2Y + 6);
      doc.text(`Nominal Tagihan: ${formattedPrice}`, margin + 4, p2Y + 11.5);

      doc.text(`Status: ${badgeText}`, margin + 100, p2Y + 6);
      doc.text(`Metode: ${order.payment_method || "GOPAY"}`, margin + 100, p2Y + 11.5);

      // Image Rendering Area
      p2Y += 21;
      const availableWidth = contentWidth;
      const availableHeight = pageHeight - p2Y - 20;

      let drawWidth = availableWidth;
      let drawHeight = (imgInfo.height / imgInfo.width) * drawWidth;

      if (drawHeight > availableHeight) {
        drawHeight = availableHeight;
        drawWidth = (imgInfo.width / imgInfo.height) * drawHeight;
      }

      const drawX = margin + (availableWidth - drawWidth) / 2;
      const drawY = p2Y + (availableHeight - drawHeight) / 2;

      // Draw background frame around image
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(drawX - 2, drawY - 2, drawWidth + 4, drawHeight + 4, 1.5, 1.5, "FD");

      try {
        const format = imgInfo.dataUrl.includes("png") ? "PNG" : "JPEG";
        doc.addImage(imgInfo.dataUrl, format, drawX, drawY, drawWidth, drawHeight);
      } catch {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(239, 68, 68);
        doc.text("Gagal merender gambar bukti transfer.", margin + 10, p2Y + 20);
      }

      // Footer Page 2
      const footY = pageHeight - 12;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, footY - 2, pageWidth - margin, footY - 2);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Lampiran Bukti Pembayaran Digital — Ladi (Layanan Digital)", margin, footY + 2);
      doc.text("Halaman 2 dari 2", pageWidth - margin, footY + 2, { align: "right" });
    }
  }

  return doc;
}

/**
 * Trigger browser download for the Invoice PDF
 */
export async function downloadInvoicePdf(
  order: OrderItem,
  options: { includeProof?: boolean } = { includeProof: true }
): Promise<void> {
  const doc = await createInvoicePdf(order, options);
  const fileName = `Invoice-${order.order_number}.pdf`;
  doc.save(fileName);
}

/**
 * Trigger browser download exclusively for the Payment Proof image or single-page PDF
 */
export async function downloadProofPdf(order: OrderItem): Promise<void> {
  if (!order.payment_proof) {
    alert("Tidak ada bukti pembayaran yang diunggah untuk pesanan ini.");
    return;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("BUKTI TRANSFER PEMBAYARAN", margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Invoice #${order.order_number} | Klien: ${order.customer_name} (${order.customer_phone})`, margin, 24);

  const imgInfo = await getImageDimensions(order.payment_proof);
  if (imgInfo) {
    const availableWidth = contentWidth;
    const availableHeight = pageHeight - 45;

    let drawWidth = availableWidth;
    let drawHeight = (imgInfo.height / imgInfo.width) * drawWidth;

    if (drawHeight > availableHeight) {
      drawHeight = availableHeight;
      drawWidth = (imgInfo.width / imgInfo.height) * drawHeight;
    }

    const drawX = margin + (availableWidth - drawWidth) / 2;
    const drawY = 32 + (availableHeight - drawHeight) / 2;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(drawX - 2, drawY - 2, drawWidth + 4, drawHeight + 4, 1.5, 1.5, "FD");

    const format = imgInfo.dataUrl.includes("png") ? "PNG" : "JPEG";
    doc.addImage(imgInfo.dataUrl, format, drawX, drawY, drawWidth, drawHeight);
  }

  doc.save(`Bukti-Transfer-${order.order_number}.pdf`);
}
