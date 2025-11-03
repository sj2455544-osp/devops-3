import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconComponent = React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;

type IconName = keyof typeof LucideIcons;

interface DynamicIconProps {
	name: string;
	size?: number;
	color?: string;
}

export default function DynamicIcon({ name, size = 24, color = "currentColor" }: DynamicIconProps) {
	const LucideIcon = LucideIcons[name as IconName] as IconComponent | undefined;

	if (!LucideIcon) {
		const Fallback = LucideIcons.HelpCircle as IconComponent;
		return <Fallback size={size} color={color} />;
	}

	return <LucideIcon size={size} color={color} />;
}
