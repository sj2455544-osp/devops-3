"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface LazyIconProps {
	iconUrl?: string | null;
	fallback: React.ReactElement;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
	alt?: string;
}

const sizeClasses = {
	sm: "w-4 h-4",
	md: "w-6 h-6",
	lg: "w-8 h-8",
	xl: "w-12 h-12",
};

// Cache for loaded icons to avoid re-fetching
const iconCache = new Map<string, { element: React.ReactElement; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default function LazyIcon({ iconUrl, fallback, className = "", size = "md", alt = "Icon" }: LazyIconProps) {
	const [iconState, setIconState] = useState<{
		loading: boolean;
		error: boolean;
		iconElement: React.ReactElement | null;
	}>({
		loading: false,
		error: false,
		iconElement: null,
	});

	const loadIcon = useCallback(
		async (url: string) => {
			// Check cache first
			const cached = iconCache.get(url);
			if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
				setIconState({
					loading: false,
					error: false,
					iconElement: cached.element,
				});
				return;
			}

			setIconState({ loading: true, error: false, iconElement: null });

			try {
				// Check if it's a react-icons identifier (e.g., "FaReact", "SiNextdotjs")
				if (/^(Fa|Si|Ai|Bi|Bs|Cg|Di|Fi|Fc|Gi|Go|Gr|Hi|Im|Io|Lu|Md|Pi|Ri|Rx|Sl|Tb|Ti|Vsc|Wi)[A-Z]/.test(url)) {
					try {
						let iconModule;
						const iconName = url;

						// Determine which react-icons package to use based on prefix
						if (iconName.startsWith("Fa")) {
							iconModule = await import("react-icons/fa");
						} else if (iconName.startsWith("Si")) {
							iconModule = await import("react-icons/si");
						} else if (iconName.startsWith("Ai")) {
							iconModule = await import("react-icons/ai");
						} else if (iconName.startsWith("Bi")) {
							iconModule = await import("react-icons/bi");
						} else if (iconName.startsWith("Bs")) {
							iconModule = await import("react-icons/bs");
						} else if (iconName.startsWith("Cg")) {
							iconModule = await import("react-icons/cg");
						} else if (iconName.startsWith("Di")) {
							iconModule = await import("react-icons/di");
						} else if (iconName.startsWith("Fi")) {
							iconModule = await import("react-icons/fi");
						} else if (iconName.startsWith("Fc")) {
							iconModule = await import("react-icons/fc");
						} else if (iconName.startsWith("Gi")) {
							iconModule = await import("react-icons/gi");
						} else if (iconName.startsWith("Go")) {
							iconModule = await import("react-icons/go");
						} else if (iconName.startsWith("Gr")) {
							iconModule = await import("react-icons/gr");
						} else if (iconName.startsWith("Hi")) {
							iconModule = await import("react-icons/hi");
						} else if (iconName.startsWith("Im")) {
							iconModule = await import("react-icons/im");
						} else if (iconName.startsWith("Io")) {
							iconModule = await import("react-icons/io5");
						} else if (iconName.startsWith("Lu")) {
							iconModule = await import("react-icons/lu");
						} else if (iconName.startsWith("Md")) {
							iconModule = await import("react-icons/md");
						} else if (iconName.startsWith("Pi")) {
							iconModule = await import("react-icons/pi");
						} else if (iconName.startsWith("Ri")) {
							iconModule = await import("react-icons/ri");
						} else if (iconName.startsWith("Rx")) {
							iconModule = await import("react-icons/rx");
						} else if (iconName.startsWith("Sl")) {
							iconModule = await import("react-icons/sl");
						} else if (iconName.startsWith("Tb")) {
							iconModule = await import("react-icons/tb");
						} else if (iconName.startsWith("Ti")) {
							iconModule = await import("react-icons/ti");
						} else if (iconName.startsWith("Vsc")) {
							iconModule = await import("react-icons/vsc");
						} else if (iconName.startsWith("Wi")) {
							iconModule = await import("react-icons/wi");
						} else {
							throw new Error(`Unsupported icon prefix: ${iconName}`);
						}

						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const IconComponent = (iconModule as any)[iconName];

						if (IconComponent && typeof IconComponent === "function") {
							const iconElement = (
								<div className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center`}>
									<IconComponent className={sizeClasses[size]} aria-label={alt} />
								</div>
							);

							iconCache.set(url, { element: iconElement, timestamp: Date.now() });
							setIconState({
								loading: false,
								error: false,
								iconElement: iconElement,
							});
							return;
						}
					} catch (iconError) {
						console.warn(`Failed to load react-icon ${url}:`, iconError);
						// Fall through to other loading methods
					}
				}

				// Check if it's an emoji or Unicode character
				if (url.length <= 4 && /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(url)) {
					const emojiElement = (
						<span className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center text-center`} role="img" aria-label={alt}>
							{url}
						</span>
					);

					iconCache.set(url, { element: emojiElement, timestamp: Date.now() });
					setIconState({
						loading: false,
						error: false,
						iconElement: emojiElement,
					});
					return;
				}

				// Check if it's a valid URL (SVG, PNG, etc.)
				if (url.startsWith("http") || url.startsWith("/")) {
					const response = await fetch(url);

					if (!response.ok) {
						throw new Error(`Failed to load icon: ${response.status}`);
					}

					const contentType = response.headers.get("content-type");

					if (contentType?.includes("image/svg+xml") || url.endsWith(".svg")) {
						const svgText = await response.text();
						const iconElement = (
							<div className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center`} dangerouslySetInnerHTML={{ __html: svgText }} role="img" aria-label={alt} />
						);

						iconCache.set(url, { element: iconElement, timestamp: Date.now() });
						setIconState({
							loading: false,
							error: false,
							iconElement: iconElement,
						});
						return;
					}

					if (contentType?.startsWith("image/")) {
						const iconElement = (
							<div className={`${sizeClasses[size]} ${className} relative inline-block`}>
								<Image
									src={url}
									alt={alt}
									fill
									className="object-contain"
									onError={() => {
										setIconState({
											loading: false,
											error: true,
											iconElement: null,
										});
									}}
								/>
							</div>
						);

						iconCache.set(url, { element: iconElement, timestamp: Date.now() });
						setIconState({
							loading: false,
							error: false,
							iconElement: iconElement,
						});
						return;
					}
				}

				// If we reach here, it's an unsupported format
				throw new Error("Unsupported icon format");
			} catch (error) {
				console.warn("Failed to load icon:", url, error);
				setIconState({
					loading: false,
					error: true,
					iconElement: null,
				});
			}
		},
		[size, className, alt]
	);

	useEffect(() => {
		if (iconUrl && iconUrl.trim() !== "") {
			loadIcon(iconUrl.trim());
		} else {
			setIconState({
				loading: false,
				error: false,
				iconElement: null,
			});
		}
	}, [iconUrl, loadIcon]);

	// Show loading state
	if (iconState.loading) {
		return (
			<div className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center`}>
				<Loader2 className={`${sizeClasses[size]} animate-spin text-gray-400`} />
			</div>
		);
	}

	// Show loaded icon if available
	if (iconState.iconElement && !iconState.error) {
		return iconState.iconElement;
	}

	// Show fallback for error or no icon URL
	return <div className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center`}>{fallback}</div>;
}
