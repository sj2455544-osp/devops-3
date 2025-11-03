"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

interface AuthGuardProps {
	children: React.ReactNode;
	redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectTo = "/" }) => {
	const { isAuthenticated, checkAuth, user, token } = useAuthStore();
	const router = useRouter();
	const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);
	const [isChecking, setIsChecking] = React.useState(false);

	useEffect(() => {
		// Only check authentication once when component mounts
		if (!hasCheckedAuth) {
			const verifyAuth = async () => {
				setIsChecking(true);

				try {
					// If we have stored auth data, validate it
					if (user && token) {
						await checkAuth();
					}
					// If no stored data, authentication will be false
				} catch (error) {
					console.error("Auth check failed:", error);
				} finally {
					setIsChecking(false);
					setHasCheckedAuth(true);
				}
			};

			verifyAuth();
		}
	}, []); // Empty dependency array - only run once on mount

	useEffect(() => {
		// Only redirect if we've finished checking and user is not authenticated
		if (hasCheckedAuth && !isChecking && !isAuthenticated) {
			router.push(redirectTo);
		}
	}, [hasCheckedAuth, isChecking, isAuthenticated, router, redirectTo]);

	// Show loading only during initial authentication check
	if (!hasCheckedAuth || isChecking) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
				<p className="text-slate-400 text-lg text-center max-w-xs">Checking authentication...</p>
			</div>
		);
	}

	// If not authenticated after checking, don't render children (redirect will happen)
	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
};

export default AuthGuard;
