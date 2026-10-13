import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBlogById, updateBlog, deleteBlog } from "@/app/lib/storage";
import { verifyCanManageBlogs } from "@/app/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyCanManageBlogs(request);
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateBlog(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    // Segarkan seluruh rute website
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/blogs");

    return NextResponse.json({ success: true, message: "Artikel berhasil diperbarui", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyCanManageBlogs(request);
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteBlog(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan atau sudah terhapus" }, { status: 404 });
    }

    // Segarkan seluruh rute website
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath("/admin");
    revalidatePath("/admin/blogs");

    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
