"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
	const pathname = usePathname();

	// Hide header on dashboard pages
	const isDashboardPage = pathname?.startsWith("/dashboard");

	if (isDashboardPage) {
		return null;
	}

	return <Header />;
}
