import { NextRequest, NextResponse } from "next/server";
import { getTemplates, getTemplatesByPackage, createTemplate } from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageSlug = searchParams.get("package");

    let templates;
    if (packageSlug) {
      templates = await getTemplatesByPackage(packageSlug);
    } else {
      templates = await getTemplates();
    }

    return NextResponse.json({
      success: true,
      count: templates.length,
      templates,
      data: templates,
    });
  } catch (error: any) {
    console.error("API Templates GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat katalog template." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Administrator yang berhak menambah template." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama template wajib diisi." },
        { status: 400 }
      );
    }

    const created = await createTemplate(body);

    return NextResponse.json({
      success: true,
      message: `Template "${created.name}" berhasil ditambahkan.`,
      data: created,
    });
  } catch (error: any) {
    console.error("API Templates POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat template." },
      { status: 500 }
    );
  }
}
