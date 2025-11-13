"use client"
import { useRouter } from "next/navigation";
import { VscHome, VscCreditCard } from 'react-icons/vsc';
import Dock from "@/components/Dock";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const items = [
    {
      icon: <VscHome size={18} />,
      label: 'Shop',
      onClick: () => router.push('/'),
    },
    {
      icon: <VscCreditCard size={18} />,
      label: 'Checkout',
      onClick: () => router.push('/checkout'),
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen  flex flex-col relative">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        <main className="flex-1">{children}</main>

        {/* ReactBits Dock Navigation */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <Dock
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
