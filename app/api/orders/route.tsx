import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open SQLite database
async function openDB() {
  return open({
    filename: '../tweaksino/db.db', // adjust path if needed
    driver: sqlite3.Database,
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const password = url.searchParams.get('password');

    if (!password) {
      return NextResponse.json({ error: 'Password query parameter is required' }, { status: 400 });
    }

    const db = await openDB();

    // Find user by password
    const user = await db.get(`SELECT Id FROM Bitch WHERE Password = ?`, [btoa(password)]);
    if (!user) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Get all orders for this user
    const orders = await db.all(`
      SELECT
        ShopOrder.Id AS id,
        ShopOrder.ShopId AS shopId,
        ShopOrder.McItemId AS mcItemId,
        ShopOrder.Quantity AS quantity,
        ShopOrder.Collected AS collected,
        McItem.Price AS price
      FROM ShopOrder
      JOIN McItem ON ShopOrder.McItemId = McItem.Id
      WHERE ShopOrder.UserId = ?
    `, [user.Id]);

    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.quantity || !body.price || !body.password) {
      return NextResponse.json({ error: 'mcItemId, quantity, price, and password are required' }, { status: 400 });
    }

    const db = await openDB();

    console.log("Password passed was: " +  body.password)

    // Find user
    const user = await db.get(`SELECT * FROM Bitch WHERE Password = ?`, [btoa(body.password)]);
    if (!user) {
      console.log("Could not find password")
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if ((body.price * body.quantity) > user.Money) {
      return NextResponse.json({ error: 'Not enough money in account' }, { status: 402 });
    }

    // Check ShopItem stock
    const shopItem = await db.get(`SELECT Quantity FROM ShopItem WHERE McItemId = ? AND ShopId = 0`, [body.name]);
    if (!shopItem || shopItem.Quantity < body.quantity) {
      return NextResponse.json({ error: 'Not enough stock' }, { status: 403 });
    }

    // Update stock
    await db.run(
      `UPDATE ShopItem SET Quantity = Quantity - ? WHERE McItemId = ? AND ShopId = 0`,
      [body.quantity, body.name]
    );

    // Insert new order
    const result = await db.run(
      `INSERT INTO ShopOrder (ShopId, McItemId, Quantity, UserId, Collected) VALUES (?, ?, ?, ?, 0)`,
      [0, body.name, body.quantity, user.Id]
    );

    await db.run(
            `update Bitch set Money = Money - ? where Id = ?`,
            [body.price * body.quantity, user.Id])


    const newOrder = await db.get(`
      SELECT
        ShopOrder.Id AS id,
        ShopOrder.ShopId AS shopId,
        ShopOrder.McItemId AS mcItemId,
        ShopOrder.Quantity AS quantity,
        ShopOrder.Collected AS collected,
        McItem.Price AS price
      FROM ShopOrder
      JOIN McItem ON ShopOrder.McItemId = McItem.Id
      WHERE ShopOrder.Id = ?
    `, [result.lastID]);

    return NextResponse.json(newOrder);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

