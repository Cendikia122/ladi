import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders, getServicePackageBySlug } from "@/app/lib/storage";
import { verifyToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

// Helper generate order number unik
function generateOrderNumber(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LADI-${year}${month}-${random}`;
}

// Fallback pricing mapping jika slug cocok
const PRICE_MAP: Record<string, { name: string; price: number }> = {
  "paket-exist": { name: "Paket EXIST", price: 299000 },
  "paket-rise": { name: "Paket RISE", price: 999000 },
  "paket-run": { name: "Paket RUN", price: 2499000 },
  "paket-guard": { name: "Paket GUARD", price: 350000 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      package_slug,
      package_name: customPackageName,
      package_price: customPackagePrice,
      customer_name,
      customer_phone,
      customer_email,
      business_name,
      business_category,
      domain_requested,
      notes,
      payment_method,
      order_type,
      template_name,
      template_url,
      template_tech,
      domain_choice,
      hosting_duration,
      addons,
    } = body;

    // 1. Validasi input wajib
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ success: false, error: "Nama lengkap wajib diisi." }, { status: 400 });
    }

    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json({ success: false, error: "Nomor WhatsApp wajib diisi." }, { status: 400 });
    }

    // Normalisasi nomor telepon Indonesia
    let cleanPhone = customer_phone.trim().replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, error: "Format nomor WhatsApp tidak valid (contoh: 08123456789)." },
        { status: 400 }
      );
    }

    if (!business_name || !business_name.trim()) {
      return NextResponse.json({ success: false, error: "Nama usaha / bisnis wajib diisi." }, { status: 400 });
    }

    // 2. Ambil informasi paket & harga
    const cleanSlug = String(package_slug || "").toLowerCase().trim();
    let packageName = customPackageName || "Paket Kustom Ladi";
    let packagePrice = 299000;

    if (customPackagePrice && Number(customPackagePrice) > 0) {
      packagePrice = Math.round(Number(customPackagePrice));
      if (customPackageName) packageName = customPackageName;
    } else {
      const pkgData = await getServicePackageBySlug(cleanSlug);
      if (pkgData) {
        packageName = pkgData.name;
        const numMatch = pkgData.price.replace(/[^0-9]/g, "");
        if (numMatch) {
          packagePrice = parseInt(numMatch, 10);
        }
      } else if (PRICE_MAP[cleanSlug]) {
        packageName = PRICE_MAP[cleanSlug].name;
        packagePrice = PRICE_MAP[cleanSlug].price;
      }
    }

    // 3. Generate Order Number
    const orderNumber = generateOrderNumber();

    // 4. Simpan ke database MySQL / fallback
    const newOrder = await createOrder({
      order_number: orderNumber,
      package_slug: cleanSlug || "paket-exist",
      package_name: packageName,
      package_price: packagePrice,
      customer_name: customer_name.trim(),
      customer_phone: cleanPhone,
      customer_email: customer_email ? customer_email.trim() : "",
      business_name: business_name.trim(),
      business_category: business_category ? business_category.trim() : "Lainnya",
      domain_requested: domain_requested ? domain_requested.trim() : (domain_choice || ""),
      notes: notes ? notes.trim() : "",
      payment_method: payment_method || "GOPAY",
      payment_status: "unpaid",
      order_status: "new",
      order_type: order_type || (cleanSlug === "custom-builder" ? "pecahan" : "paketan"),
      template_name: template_name || "",
      template_url: template_url || "",
      template_tech: template_tech || "",
      domain_choice: domain_choice || "",
      hosting_duration: hosting_duration || "",
      addons: typeof addons === "object" ? JSON.stringify(addons) : (addons || ""),
    });

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat.",
      order_number: newOrder.order_number,
      redirect_url: `/order/${newOrder.order_number}`,
    });
  } catch (error: any) {
    console.error("API Orders POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Terjadi kendala saat memproses pesanan." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verifikasi akses admin
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const orders = await getOrders(limit, status);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("API Orders GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mengambil daftar pesanan." },
      { status: 500 }
    );
  }
}
