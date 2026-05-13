import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Smart Warehouse",
  description: "Warehouse operations for inventory, stock, and approvals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Toaster richColors position="top-center" theme="light" />
        <SidebarProvider>
          <TooltipProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-4 md:hidden md:h-fit">
                <SidebarTrigger />
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</main>
            </SidebarInset>
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
