import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DataPaginationProps {
	className?: string;
	totalPages: number;
	currentPage: number;
	onPageChange: (pageIndex: number) => void;
}

export function DataPagination({
	className,
	totalPages,
	currentPage,
	onPageChange,
}: DataPaginationProps) {
	const getPageNumbers = () => {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const pages = [];
		pages.push(1);

		const startPage = Math.max(2, currentPage - 1);
		const endPage = Math.min(totalPages - 1, currentPage + 1);

		if (startPage > 2) {
			pages.push(-1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (endPage < totalPages - 1) {
			pages.push(-2);
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<Pagination className={cn("sm:justify-start", className)}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && currentPage > 1) {
								onPageChange(currentPage - 1);
							}
						}}
						className={
							currentPage === 1
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>

				{getPageNumbers().map((pageNumber, idx) => (
					<PaginationItem key={idx}>
						{pageNumber < 0 ? (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="ghost" asChild>
										<PaginationEllipsis />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									sideOffset={10}
									className="flex flex-col gap-4 p-4 bg-background border rounded-lg shadow-md"
								>
									<Label className="font-bold">
										Navegar a pagina especifica
									</Label>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											const input = (e.target as HTMLFormElement)[
												"page-number"
											] as HTMLInputElement;
											const page = Number(input.value);
											if (page >= 1 && page <= totalPages) {
												onPageChange(page);
											}
										}}
										className="inline-flex gap-x-2 items-center"
									>
										<Input
											id="page-number"
											placeholder={totalPages.toString()}
											type="number"
											className="w-full max-w-[17ch]"
										/>
										<Button type="submit" size="sm">
											Ir
										</Button>
									</form>
								</PopoverContent>
							</Popover>
						) : (
							<PaginationLink
								onClick={() => onPageChange(pageNumber)}
								isActive={pageNumber === currentPage}
								className="cursor-pointer"
							>
								{pageNumber}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						onClick={() =>
							currentPage < totalPages && onPageChange(currentPage + 1)
						}
						className={
							currentPage >= totalPages
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
