import { NextResponse } from 'next/server';
import { AteraClient } from '@/lib/atera-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const itemsInPage = searchParams.get('itemsInPage') || '100';

    const data = await AteraClient.getDepartments({ page, itemsInPage });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('GET /api/atera/department error:', err);
    return new NextResponse(
      JSON.stringify({ error: err.message || 'Failed to fetch departments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
