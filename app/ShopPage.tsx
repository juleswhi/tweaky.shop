'use client';

import { useState, useEffect } from 'react';
import { Cookies } from 'typescript-cookie';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useCartStore } from './store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopItem {
    id: number;
    shopId: number;
    mcItemId: string;
    quantity: number;
    price: number;
}

export default function ShopPage() {
    const addToCart = useCartStore((s) => s.addToCart);

    const [items, setItems] = useState<ShopItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [money, setMoney] = useState<number | null>(null);
    const [cookie, setCookies] = useState("")

    const selectedItem = items.find((i) => i.mcItemId === selectedId);

    // Fetch ShopItems
    useEffect(() => {
        async function fetchItems() {
            try {
                const res = await fetch('/api/items');
                const data: ShopItem[] = await res.json();
                setItems(data);
            } catch (err) {
                console.error('Failed to fetch shop items:', err);
            }
        }

        fetchItems();
    }, []);

    useEffect(() => {
        const passcode = Cookies.get('site_passcode');
        if (!passcode) return;

        setCookies(passcode.toString())
    }, []);


    // Fetch user money using passcode from cookies
    useEffect(() => {
        async function fetchMoney() {
            const passcode = Cookies.get('site_passcode');
            if (!passcode) return;

            try {
                const res = await fetch('/api/money', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: passcode }),
                });

                const data = await res.json();
                if (res.ok) {
                    setMoney(data.money);
                } else {
                    console.warn('Failed to fetch money:', data.error);
                }
            } catch (err) {
                console.error('Error fetching money:', err);
            }
        }

        fetchMoney();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold mb-2">Shop</h1>

            {money !== null && (
                <p className="text-lg text-yellow-600 dark:text-yellow-400 mb-4 font-semibold">
                    Your Money: ${money.toFixed(2)}
                </p>
            )}

            {/* Shop Items Table */}
            <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item (McItem ID)</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={`${item.shopId}-${item.mcItemId}`} // unique key
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => {
                                    setSelectedId(item.mcItemId);
                                    setQuantity(1);
                                }}
                            >
                                <TableCell className="font-medium">{item.mcItemId}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal for selected item */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        key="card-modal"
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            className="w-full max-w-sm"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
                                <CardHeader>
                                    <CardTitle>{selectedItem.mcItemId}</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-2">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Price: ${selectedItem.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Stock: {selectedItem.quantity}
                                    </p>

                                    <div className="flex items-center space-x-2 mt-3">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={selectedItem.quantity}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-20"
                                        />
                                        <Button
                                            onClick={() => {
                                                addToCart(
                                                    {
                                                        name: selectedItem.mcItemId,
                                                        price: selectedItem.price,
                                                        quantity: quantity,
                                                        password: cookie,
                                                    },
                                                );
                                                setSelectedId(null);
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedId(null)}
                                        className="w-full"
                                    >
                                        Close
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

