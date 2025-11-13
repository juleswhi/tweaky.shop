'use client';
import { useEffect, useState } from 'react';
import { Cookies } from 'typescript-cookie';

export interface ShopOrder {
  id: number;
  shopId: number;
  mcItemId: string;
  quantity: number;
  collected: boolean;
}

export default function CheckoutPage() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        async function fetchOrders() {
            const password = Cookies.get('site_passcode');
            if (!password) {
                console.error('No password found in cookies');
                return;
            }

            console.log("password is " + password.toString())
            const res = await fetch(`/api/orders?password=${encodeURIComponent(password.toString())}`);
            if (!res.ok) {
                console.error('Failed to fetch orders:', await res.text());
                return;
            }

            const data: ShopOrder[] = await res.json();
            setOrders(data);
            setLoading(false);
        }

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold">McItem ID: {order.mcItemId}</h2>
                <p className="text-sm text-gray-600">Shop ID: {order.shopId}</p>
                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-500">
                  Collected: {order.collected ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

