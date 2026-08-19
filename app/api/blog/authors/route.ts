import { NextResponse } from "next/server";
import { readAuthors } from "../_store";

export async function GET() {
  try {
    const authors = await readAuthors();
    return NextResponse.json({ success: true, data: authors });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load authors" }, { status: 500 });
  }
}
