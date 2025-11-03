import React from "react";
import {
	Code,
	Database,
	Smartphone,
	Globe,
	Shield,
	BarChart3,
	Server,
	Cloud,
	Brain,
	Palette,
	TestTube,
	Box,
	Zap,
	Cpu,
	Lock,
	LineChart,
	Layers,
	Binary,
	Workflow,
	Terminal,
	GitBranch,
	Target,
	Building,
} from "lucide-react";

// Map technology names to react-icons identifiers
export const getTechnologyReactIcon = (slug: string, name: string): string | null => {
	const lowerSlug = slug.toLowerCase();
	const lowerName = name.toLowerCase();

	// Frontend Technologies
	if (lowerSlug.includes("react") || lowerName.includes("react")) {
		return "FaReact";
	}
	if (lowerSlug.includes("vue") || lowerName.includes("vue")) {
		return "FaVuejs";
	}
	if (lowerSlug.includes("angular") || lowerName.includes("angular")) {
		return "FaAngular";
	}
	if (lowerSlug.includes("javascript") || lowerName.includes("javascript") || lowerSlug.includes("js")) {
		return "FaJs";
	}
	if (lowerSlug.includes("html") || lowerName.includes("html")) {
		return "FaHtml5";
	}
	if (lowerSlug.includes("css") || lowerName.includes("css")) {
		return "FaCss3Alt";
	}

	// Backend Technologies
	if (lowerSlug.includes("node") || lowerName.includes("node") || lowerSlug.includes("nodejs")) {
		return "FaNodeJs";
	}
	if (lowerSlug.includes("python") || lowerName.includes("python")) {
		return "FaPython";
	}
	if (lowerSlug.includes("java") || lowerName.includes("java")) {
		return "FaJava";
	}
	if (lowerSlug.includes("php") || lowerName.includes("php")) {
		return "FaPhp";
	}

	// Databases
	if (lowerSlug.includes("mongodb") || lowerName.includes("mongodb") || lowerSlug.includes("mongo")) {
		return "SiMongodb";
	}

	// Mobile Development
	if (lowerSlug.includes("flutter") || lowerName.includes("flutter")) {
		return "SiFlutter";
	}
	if (lowerSlug.includes("android") || lowerName.includes("android")) {
		return "FaAndroid";
	}
	if (lowerSlug.includes("apple") || lowerName.includes("apple") || lowerSlug.includes("ios")) {
		return "FaApple";
	}

	// Cloud & DevOps
	if (lowerSlug.includes("aws") || lowerName.includes("aws") || lowerName.includes("amazon")) {
		return "FaAws";
	}
	if (lowerSlug.includes("docker") || lowerName.includes("docker")) {
		return "FaDocker";
	}
	if (lowerSlug.includes("git") || lowerName.includes("git")) {
		return "FaGitAlt";
	}

	// Popular Brands/Services
	if (lowerSlug.includes("github") || lowerName.includes("github")) {
		return "FaGithub";
	}
	if (lowerSlug.includes("gitlab") || lowerName.includes("gitlab")) {
		return "FaGitlab";
	}

	return null;
};

// Technology icon mapping based on common technology names/slugs
export const getTechnologyIcon = (slug: string, name: string): React.ReactElement => {
	const lowerSlug = slug.toLowerCase();
	const lowerName = name.toLowerCase();

	// Frontend Technologies
	if (lowerSlug.includes("react") || lowerName.includes("react")) {
		return <Code className="w-5 h-5" />;
	}
	if (lowerSlug.includes("vue") || lowerName.includes("vue")) {
		return <Code className="w-5 h-5" />;
	}
	if (lowerSlug.includes("angular") || lowerName.includes("angular")) {
		return <Code className="w-5 h-5" />;
	}
	if (lowerSlug.includes("javascript") || lowerName.includes("javascript") || lowerSlug.includes("js")) {
		return <Terminal className="w-5 h-5" />;
	}
	if (lowerSlug.includes("typescript") || lowerName.includes("typescript") || lowerSlug.includes("ts")) {
		return <Terminal className="w-5 h-5" />;
	}
	if (lowerSlug.includes("html") || lowerName.includes("html")) {
		return <Globe className="w-5 h-5" />;
	}
	if (lowerSlug.includes("css") || lowerName.includes("css")) {
		return <Palette className="w-5 h-5" />;
	}

	// Backend Technologies
	if (lowerSlug.includes("node") || lowerName.includes("node") || lowerSlug.includes("nodejs")) {
		return <Server className="w-5 h-5" />;
	}
	if (lowerSlug.includes("python") || lowerName.includes("python")) {
		return <Binary className="w-5 h-5" />;
	}
	if (lowerSlug.includes("java") || lowerName.includes("java")) {
		return <Cpu className="w-5 h-5" />;
	}
	if (lowerSlug.includes("php") || lowerName.includes("php")) {
		return <Server className="w-5 h-5" />;
	}
	if (lowerSlug.includes("spring") || lowerName.includes("spring")) {
		return <Layers className="w-5 h-5" />;
	}
	if (lowerSlug.includes("express") || lowerName.includes("express")) {
		return <Zap className="w-5 h-5" />;
	}

	// Databases
	if (lowerSlug.includes("mongodb") || lowerName.includes("mongodb") || lowerSlug.includes("mongo")) {
		return <Database className="w-5 h-5" />;
	}
	if (lowerSlug.includes("mysql") || lowerName.includes("mysql")) {
		return <Database className="w-5 h-5" />;
	}
	if (lowerSlug.includes("postgresql") || lowerName.includes("postgresql") || lowerSlug.includes("postgres")) {
		return <Database className="w-5 h-5" />;
	}

	// Mobile Development
	if (lowerSlug.includes("flutter") || lowerName.includes("flutter")) {
		return <Smartphone className="w-5 h-5" />;
	}
	if (lowerSlug.includes("android") || lowerName.includes("android")) {
		return <Smartphone className="w-5 h-5" />;
	}
	if (lowerSlug.includes("ios") || lowerName.includes("ios")) {
		return <Smartphone className="w-5 h-5" />;
	}
	if (lowerSlug.includes("react-native") || lowerName.includes("react native")) {
		return <Smartphone className="w-5 h-5" />;
	}

	// Cloud & DevOps
	if (lowerSlug.includes("aws") || lowerName.includes("aws") || lowerName.includes("amazon")) {
		return <Cloud className="w-5 h-5" />;
	}
	if (lowerSlug.includes("azure") || lowerName.includes("azure")) {
		return <Cloud className="w-5 h-5" />;
	}
	if (lowerSlug.includes("gcp") || lowerName.includes("google cloud")) {
		return <Cloud className="w-5 h-5" />;
	}
	if (lowerSlug.includes("docker") || lowerName.includes("docker")) {
		return <Box className="w-5 h-5" />;
	}
	if (lowerSlug.includes("kubernetes") || lowerName.includes("kubernetes")) {
		return <Building className="w-5 h-5" />;
	}
	if (lowerSlug.includes("jenkins") || lowerName.includes("jenkins")) {
		return <GitBranch className="w-5 h-5" />;
	}
	if (lowerSlug.includes("devops") || lowerName.includes("devops")) {
		return <Workflow className="w-5 h-5" />;
	}

	// AI/ML
	if (lowerSlug.includes("ai") || lowerName.includes("artificial intelligence") || lowerName.includes("machine learning")) {
		return <Brain className="w-5 h-5" />;
	}
	if (lowerSlug.includes("tensorflow") || lowerName.includes("tensorflow")) {
		return <Brain className="w-5 h-5" />;
	}
	if (lowerSlug.includes("pytorch") || lowerName.includes("pytorch")) {
		return <Brain className="w-5 h-5" />;
	}

	// Data & Analytics
	if (lowerSlug.includes("data") || lowerName.includes("data") || lowerName.includes("analytics")) {
		return <BarChart3 className="w-5 h-5" />;
	}
	if (lowerSlug.includes("tableau") || lowerName.includes("tableau")) {
		return <LineChart className="w-5 h-5" />;
	}
	if (lowerSlug.includes("power-bi") || lowerName.includes("power bi")) {
		return <BarChart3 className="w-5 h-5" />;
	}

	// Security
	if (lowerSlug.includes("security") || lowerName.includes("security") || lowerSlug.includes("cyber")) {
		return <Shield className="w-5 h-5" />;
	}
	if (lowerSlug.includes("blockchain") || lowerName.includes("blockchain")) {
		return <Lock className="w-5 h-5" />;
	}

	// UI/UX
	if (lowerSlug.includes("ui") || lowerSlug.includes("ux") || lowerName.includes("design")) {
		return <Palette className="w-5 h-5" />;
	}
	if (lowerSlug.includes("figma") || lowerName.includes("figma")) {
		return <Palette className="w-5 h-5" />;
	}

	// Testing
	if (lowerSlug.includes("test") || lowerName.includes("test") || lowerName.includes("qa")) {
		return <TestTube className="w-5 h-5" />;
	}

	// Tools & Others
	if (lowerSlug.includes("git") || lowerName.includes("git")) {
		return <GitBranch className="w-5 h-5" />;
	}

	// Default fallback
	return <Code className="w-5 h-5" />;
};

// Workshop category icon mapping
export const getWorkshopCategoryIcon = (category: string): React.ReactElement => {
	const lowerCategory = category.toLowerCase();

	if (lowerCategory.includes("frontend") || lowerCategory.includes("web")) {
		return <Globe className="w-8 h-8" />;
	}
	if (lowerCategory.includes("backend") || lowerCategory.includes("server")) {
		return <Server className="w-8 h-8" />;
	}
	if (lowerCategory.includes("mobile") || lowerCategory.includes("app")) {
		return <Smartphone className="w-8 h-8" />;
	}
	if (lowerCategory.includes("data") || lowerCategory.includes("analytics")) {
		return <BarChart3 className="w-8 h-8" />;
	}
	if (lowerCategory.includes("ai") || lowerCategory.includes("ml") || lowerCategory.includes("machine")) {
		return <Brain className="w-8 h-8" />;
	}
	if (lowerCategory.includes("cloud") || lowerCategory.includes("devops")) {
		return <Cloud className="w-8 h-8" />;
	}
	if (lowerCategory.includes("security") || lowerCategory.includes("cyber")) {
		return <Shield className="w-8 h-8" />;
	}
	if (lowerCategory.includes("ui") || lowerCategory.includes("ux") || lowerCategory.includes("design")) {
		return <Palette className="w-8 h-8" />;
	}
	if (lowerCategory.includes("test") || lowerCategory.includes("qa")) {
		return <TestTube className="w-8 h-8" />;
	}
	if (lowerCategory.includes("database") || lowerCategory.includes("db")) {
		return <Database className="w-8 h-8" />;
	}

	// Default fallback
	return <Target className="w-8 h-8" />;
};

// Map workshop titles to react-icons identifiers
export const getWorkshopReactIcon = (title: string, category?: string): string | null => {
	const lowerTitle = title.toLowerCase();
	const lowerCategory = category?.toLowerCase() || "";

	// React specific
	if (lowerTitle.includes("react") || lowerCategory.includes("react")) {
		return "FaReact";
	}

	// Python specific
	if (lowerTitle.includes("python") || lowerCategory.includes("python")) {
		return "FaPython";
	}

	// Java specific
	if (lowerTitle.includes("java") || lowerCategory.includes("java")) {
		return "FaJava";
	}

	// Node.js specific
	if (lowerTitle.includes("node") || lowerCategory.includes("node")) {
		return "FaNodeJs";
	}

	// Database specific
	if (lowerTitle.includes("mongodb") || lowerTitle.includes("mongo") || lowerCategory.includes("database")) {
		return "SiMongodb";
	}

	// DevOps specific
	if (lowerTitle.includes("docker") || lowerCategory.includes("devops")) {
		return "FaDocker";
	}

	// Cloud specific
	if (lowerTitle.includes("aws") || lowerCategory.includes("cloud")) {
		return "FaAws";
	}

	// Mobile specific
	if (lowerTitle.includes("flutter") || lowerCategory.includes("flutter")) {
		return "SiFlutter";
	}
	if (lowerTitle.includes("android") || lowerCategory.includes("mobile")) {
		return "FaAndroid";
	}

	// Web technologies
	if (lowerTitle.includes("javascript") || lowerTitle.includes("js")) {
		return "FaJs";
	}
	if (lowerTitle.includes("html")) {
		return "FaHtml5";
	}
	if (lowerTitle.includes("css")) {
		return "FaCss3Alt";
	}

	// Version control
	if (lowerTitle.includes("git")) {
		return "FaGitAlt";
	}

	return null;
};

// Workshop title-based icon mapping for more specific icons
export const getWorkshopIcon = (title: string, category?: string): React.ReactElement => {
	const lowerTitle = title.toLowerCase();

	// React specific
	if (lowerTitle.includes("react")) {
		return <Code className="w-8 h-8" />;
	}

	// Python specific
	if (lowerTitle.includes("python")) {
		return <Binary className="w-8 h-8" />;
	}

	// Java specific
	if (lowerTitle.includes("java")) {
		return <Cpu className="w-8 h-8" />;
	}

	// Node.js specific
	if (lowerTitle.includes("node")) {
		return <Server className="w-8 h-8" />;
	}

	// Database specific
	if (lowerTitle.includes("database") || lowerTitle.includes("mongodb") || lowerTitle.includes("sql")) {
		return <Database className="w-8 h-8" />;
	}

	// DevOps specific
	if (lowerTitle.includes("docker") || lowerTitle.includes("kubernetes") || lowerTitle.includes("jenkins")) {
		return <Box className="w-8 h-8" />;
	}

	// Cloud specific
	if (lowerTitle.includes("aws") || lowerTitle.includes("azure") || lowerTitle.includes("cloud")) {
		return <Cloud className="w-8 h-8" />;
	}

	// AI/ML specific
	if (lowerTitle.includes("ai") || lowerTitle.includes("machine learning") || lowerTitle.includes("tensorflow")) {
		return <Brain className="w-8 h-8" />;
	}

	// Security specific
	if (lowerTitle.includes("security") || lowerTitle.includes("cyber") || lowerTitle.includes("blockchain")) {
		return <Shield className="w-8 h-8" />;
	}

	// UI/UX specific
	if (lowerTitle.includes("ui") || lowerTitle.includes("ux") || lowerTitle.includes("design") || lowerTitle.includes("figma")) {
		return <Palette className="w-8 h-8" />;
	}

	// Testing specific
	if (lowerTitle.includes("test") || lowerTitle.includes("qa") || lowerTitle.includes("selenium")) {
		return <TestTube className="w-8 h-8" />;
	}

	// Data Analytics specific
	if (lowerTitle.includes("data") || lowerTitle.includes("analytics") || lowerTitle.includes("tableau")) {
		return <BarChart3 className="w-8 h-8" />;
	}

	// Mobile specific
	if (lowerTitle.includes("flutter") || lowerTitle.includes("android") || lowerTitle.includes("ios") || lowerTitle.includes("mobile")) {
		return <Smartphone className="w-8 h-8" />;
	}

	// Fallback to category-based icon if available
	if (category) {
		return getWorkshopCategoryIcon(category);
	}

	// Default fallback
	return <Target className="w-8 h-8" />;
};
