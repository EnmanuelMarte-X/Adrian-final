import { ContentLayout } from "@/components/content/layout";

export default function ContentPagesLayout({
	children,
}: { children: React.ReactNode }) {
	return <ContentLayout>{children}</ContentLayout>;
}
