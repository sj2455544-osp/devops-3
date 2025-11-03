import React from "react";
import AuthGuard from "../../components/AuthGuard";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
	return (
		<AuthGuard>
			<DashboardLayout>{children}</DashboardLayout>
		</AuthGuard>
	);
}
