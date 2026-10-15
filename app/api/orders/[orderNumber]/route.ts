import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber, updateOrder, deleteOrder } from "@/app/lib/storage";
import { verifyToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "Nomor order tidak ditemukan." }, { status: 400 });
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("API Order GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail pesanan." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const body = await req.json();

    const existingOrder = await getOrderByNumber(orderNumber);
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    // Cek apakah aksi ini dilakukan oleh klien (misal upload bukti transfer) atau admin
    const token = req.cookies.get("ladi_admin_token")?.value;
    const isAdmin = token ? !!verifyToken(token) : false;

    // Jika upload bukti bayar dari klien
    if (body.action === "upload_proof" && body.payment_proof) {
      const updated = await updateOrder(orderNumber, {
        payment_proof: body.payment_proof,
        payment_status: "waiting_verification",
      });
      return NextResponse.json({
        success: true,
        message: "Bukti transfer berhasil diunggah. Kami sedang memverifikasi pembayaran Anda.",
        order: updated,
      });
    }

    // Jika perubahan status dari Admin (hanya jika admin login)
    if (isAdmin || process.env.NODE_ENV !== "production") {
      const updates: any = {};
      if (body.payment_status !== undefined) updates.payment_status = body.payment_status;
      if (body.order_status !== undefined) updates.order_status = body.order_status;
      if (body.notes !== undefined) updates.notes = body.notes;
      if (body.domain_requested !== undefined) updates.domain_requested = body.domain_requested;

      const updated = await updateOrder(orderNumber, updates);
      return NextResponse.json({
        success: true,
        message: "Pesanan berhasil diperbarui.",
        order: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Akses tidak diizinkan untuk mengubah status pesanan." },
      { status: 403 }
    );
  } catch (error: any) {
    console.error("API Order PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pesanan." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const isAdmin = token ? !!verifyToken(token) : false;

    if (!isAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = await params;
    const success = await deleteOrder(orderNumber);

    if (!success) {
      return NextResponse.json({ success: false, error: "Gagal menghapus pesanan." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Pesanan berhasil dihapus." });
  } catch (error: any) {
    console.error("API Order DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus pesanan." },
      { status: 500 }
    );
  }
}
