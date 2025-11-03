import React from "react";
import AuthGuard from "../../../components/AuthGuard";

interface ProfileLayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: ProfileLayoutProps) {
	return <AuthGuard>{children}</AuthGuard>;
}
