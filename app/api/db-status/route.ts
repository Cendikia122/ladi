import { NextResponse } from "next/server";
import { checkDbConnection, isDbCircuitOpen } from "@/app/lib/mysql";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await checkDbConnection();
  return NextResponse.json({
    ...status,
    circuitOpen: isDbCircuitOpen(),
  });
}
