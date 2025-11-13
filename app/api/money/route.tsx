import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDB() {
  return open({
    filename: '../tweaksino/db.db', // adjust path to your DB
    driver: sqlite3.Database,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body.password;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const db = await openDB();

    // Find the user with the given password
    const user = await db.get(`
      SELECT *
      FROM Bitch
      WHERE Password = ?
      LIMIT 1
    `, [btoa(password)]);

    if (!user) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ money: user.Money });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

