import { NextRequest, NextResponse } from "next/server";
import { searchOrdersByKeyword, getOrderByNumber, getOrdersByPhone } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Silakan masukkan nomor WhatsApp atau nomor pesanan Anda." },
        { status: 400 }
      );
    }

    let orders: any[] = [];

    // Jika awalan LADI (Nomor Invoice)
    if (query.toUpperCase().startsWith("LADI-")) {
      const single = await getOrderByNumber(query.toUpperCase());
      if (single) orders = [single];
    } else {
      // Coba cari berdasarkan nomor HP atau keyword
      orders = await searchOrdersByKeyword(query);
    }

    // Sanitasi data agar aman (sembunyikan catatan internal sensitif jika ada)
    const sanitized = orders.map((o) => ({
      order_number: o.order_number,
      package_name: o.package_name,
      package_price: o.package_price,
      customer_name: o.customer_name,
      business_name: o.business_name,
      payment_status: o.payment_status,
      order_status: o.order_status,
      order_type: o.order_type || "paketan",
      template_name: o.template_name || "",
      created_at: o.created_at,
    }));

    return NextResponse.json({
      success: true,
      count: sanitized.length,
      orders: sanitized,
    });
  } catch (error: any) {
    console.error("API Orders Lookup error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mencari pesanan. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
