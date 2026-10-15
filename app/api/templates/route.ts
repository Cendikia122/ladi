import { NextRequest, NextResponse } from "next/server";
import { getTemplates, getTemplatesByPackage } from "@/app/lib/storage";

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
    });
  } catch (error: any) {
    console.error("API Templates GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat katalog template." },
      { status: 500 }
    );
  }
}
