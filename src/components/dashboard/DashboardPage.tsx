import { useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function DashboardPage({
	children,
	sidebarRef,
}: {
	children: React.ReactNode;
	sidebarRef?: React.RefObject<HTMLDivElement | null>;
}) {
	const { isMobile, open } = useSidebar();

	const getSidebarWidth = useCallback(() => {
		if (sidebarRef?.current) {
			return sidebarRef.current.offsetWidth + (open ? 30 : 0);
		}

		return isMobile ? 0 : open ? 280 : 64;
	}, [sidebarRef, isMobile, open]);

	return (
		<div
			style={{
				maxWidth: `calc(100vw - ${getSidebarWidth()}px)`,
			}}
			className="flex-1 grow"
		>
			{children}
		</div>
	);
}
