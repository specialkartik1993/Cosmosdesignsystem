import { useState } from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';
import { Button } from '../../components/ui/button';
import { ComponentPage, Showcase } from './ComponentPage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationPage() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 10;

  return (
    <ComponentPage
      title="Pagination"
      description="Pagination helps users navigate through large sets of content split across multiple pages."
    >
      <Showcase title="Basic Pagination" delay={0.1} code={`<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`}>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </Showcase>

      <Showcase title="Interactive Pagination" description="Click to navigate between pages." delay={0.15} code={`<div className="flex items-center justify-center gap-1">
  <Button variant="ghost" size="icon" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
    <ChevronLeft className="w-4 h-4" />
  </Button>
  {pages.map(p => (
    <button
      key={p}
      onClick={() => setPage(p)}
      className={\`w-9 h-9 rounded-lg \${
        page === p ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'
      }\`}
    >
      {p}
    </button>
  ))}
  <Button variant="ghost" size="icon" disabled={page === total} onClick={() => setPage(p => p + 1)}>
    <ChevronRight className="w-4 h-4" />
  </Button>
</div>`}>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let page: number;
              if (currentPage <= 3) page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else page = currentPage - 2 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-[13px] transition-all duration-200 cursor-pointer ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-muted-foreground'
                  }`}
                  style={{ fontWeight: currentPage === page ? 600 : 400 }}
                >
                  {page}
                </button>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[13px] text-muted-foreground text-center">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </Showcase>

      <Showcase title="Simple Navigation" delay={0.2} code={`<div className="flex items-center justify-between">
  <Button variant="outline" size="sm">
    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
  </Button>
  <span className="text-muted-foreground">Page 3 of 10</span>
  <Button variant="outline" size="sm">
    Next <ChevronRight className="w-4 h-4 ml-1" />
  </Button>
</div>`}>
        <div className="flex items-center justify-between max-w-md">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-[13px] text-muted-foreground">Page 3 of 10</span>
          <Button variant="outline" size="sm">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Showcase>
    </ComponentPage>
  );
}