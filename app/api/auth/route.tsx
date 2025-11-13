import { NextRequest, NextResponse } from "next/server";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (typeof code !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid code type" }, { status: 400 });
  }

  try {
    const db = await open({
      filename: "../tweaksino/db.db",
      driver: sqlite3.Database,
    });

    console.log("code is " + code);
    console.log(btoa(code));

    const row = await db.get('SELECT * from Bitch WHERE Password = ?', btoa(code));

    console.log(db)
    console.log(row);

    // close db etc (depending on your setup)
    await db.close();

    if (row) {
      return NextResponse.json({ ok: true, exists: true });
    } else {
      return NextResponse.json({ ok: true, exists: false });
    }

  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }
}

