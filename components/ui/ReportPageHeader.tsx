'use client';

import { Calendar } from 'lucide-react';

interface ReportPageHeaderProps {
  title: string; 
  subtitle: string;
  dateRangeDisplay?: string;
  lang?: string;
}

export function ReportPageHeader({ title, subtitle, dateRangeDisplay, lang }: ReportPageHeaderProps) {
  const fallbackDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="report-page-header">
      <div className="report-page-header__title-group">
        <img src="/Logo_of_Atera_1.png" alt="Atera Logo" className="report-page-header__logo" />
        <div>
          <h2 className="report-page-header__title">{title}</h2>
          <p className="report-page-header__subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="report-page-header__meta">
        <span className="report-page-header__badge">Monthly Report</span>
        <span className="report-page-header__date"><Calendar aria-hidden="true" />{dateRangeDisplay || fallbackDate}</span>
      </div>
    </header>
  );
}