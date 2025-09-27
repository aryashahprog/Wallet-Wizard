import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NESSIE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing NESSIE_API_KEY" }, { status: 500 });

  const url = `https://api.nessieisreal.com/customers?key=${apiKey}`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: `Nessie error ${r.status}` }, { status: r.status });

  const data = await r.json();
  return NextResponse.json(data);
}
