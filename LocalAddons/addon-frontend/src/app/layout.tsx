import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalHeader from "@/components/shared/ConditionalHeader";
import ConditionalFooter from "@/components/shared/ConditionalFooter";
import GlobalModalManager from "@/components/modals/GlobalModalManager";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CIMAGE Add-On Courses - Your Career Pathway to Industry",
	description: "Transform your career with CIMAGE Add-On Courses. Learn from industry experts, get paid internships, and showcase your talent at prestigious hackathons.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ConditionalHeader />
				{children}
				<ConditionalFooter />
				<GlobalModalManager />
			</body>
		</html>
	);
}
