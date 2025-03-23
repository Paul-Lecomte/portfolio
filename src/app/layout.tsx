import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Desktop from "@/components/Desktop"; // Import Desktop component

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Windows 11 Portfolio",
    description: "A portfolio designed like Windows 11",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {/* Layout Structure */}
        <div className="h-screen flex flex-col">
            {/* Taskbar */}
            <div className="taskbar flex items-center justify-between p-4 fixed bottom-0 left-0 right-0">
                {/* Start Menu Button */}
                <div className="start-menu text-white">
                    <div className="start-button w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">⚙️</span>
                    </div>
                </div>

                {/* Task Icons */}
                <div className="task-icons flex space-x-4">
                    <div className="task-icon bg-gray-600 rounded-full p-2 flex items-center justify-center">
                        <span className="text-white">📂</span>
                    </div>
                    <div className="task-icon bg-gray-600 rounded-full p-2 flex items-center justify-center">
                        <span className="text-white">💻</span>
                    </div>
                </div>

                {/* System Tray */}
                <div className="system-tray flex space-x-4 text-white">
                    <div className="notification bg-gray-700 p-2 rounded-full">
                        <span>🔔</span>
                    </div>
                    <div className="user-avatar bg-gray-700 p-2 rounded-full">
                        <span>👤</span>
                    </div>
                </div>
            </div>

            {/* Desktop (Main Area) */}
            <div className="desktop-container flex-grow bg-gray-950 relative pt-16">
                <Desktop />
            </div>
        </div>
        </body>
        </html>
    );
}