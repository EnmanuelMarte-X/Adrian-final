export async function generateMetadata({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return {
		title: `Recibo de Pago - ${id || "Desconocido"}`,
	};
}

export default function VoucherLayout({
	children,
}: { children: React.ReactNode }) {
	return children;
}
