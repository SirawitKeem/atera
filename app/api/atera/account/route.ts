import { NextResponse } from 'next/server';
import { AteraClient } from '@/lib/atera-client';

export async function GET() {
  try {
    const data = await AteraClient.getAccountInfo();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('GET /api/atera/account error:', err);
    return new NextResponse(
      JSON.stringify({ error: err.message || 'Failed to fetch account info' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
