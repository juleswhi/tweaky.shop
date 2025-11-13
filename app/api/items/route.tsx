import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open SQLite database
async function openDB() {
  return open({
    filename: '../tweaksino/db.db', // adjust path as needed
    driver: sqlite3.Database,
  });
}

export async function GET() {
  const db = await openDB();

  // Fetch all ShopItems with McItem info
  const items = await db.all(`
    SELECT
      ShopItem.ShopId AS shopId,
      ShopItem.McItemId AS mcItemId,
      ShopItem.Quantity AS quantity,
      McItem.Price AS price
    FROM ShopItem
    JOIN McItem ON ShopItem.McItemId = McItem.Id
  `);

  return NextResponse.json(items);
}
