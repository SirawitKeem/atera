import type { ReactNode } from 'react';

interface ReportTableProps {
  children: ReactNode;
  className?: string;
  tableClassName?: string;
}

export function ReportTable({ children, className = '', tableClassName = '' }: ReportTableProps) {
  return (
    <div className={`report-table ${className}`.trim()}>
      <table className={`report-table__table ${tableClassName}`.trim()}>{children}</table>
    </div>
  );
}