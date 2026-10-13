import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTeamMembers, createTeamMember } from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const data = await getTeamMembers(all);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Fitur ini khusus Super Administrator." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: "Nama anggota tim wajib diisi" }, { status: 400 });
    }
    if (!body.role || !body.role.trim()) {
      return NextResponse.json({ success: false, message: "Peran/jabatan tim wajib diisi" }, { status: 400 });
    }

    const created = await createTeamMember(body);

    // Revalidate halaman beranda seketika
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/team");

    return NextResponse.json({
      success: true,
      message: "Anggota tim berhasil ditambahkan",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
