'use client';

import React from 'react';

interface BackCoverPageProps {
  pageNumber: number;
}

export default function BackCoverPage({
  pageNumber
}: BackCoverPageProps) {
  return (
    <div 
      className="a4-page"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        padding: '12mm 12mm'
      }}
    >
      {/* Completely empty clean dot-grid page */}
    </div>
  );
}
