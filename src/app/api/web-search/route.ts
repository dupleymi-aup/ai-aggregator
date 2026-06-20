import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';

let zaiInstance: ZAI | null = null;

async function getZAI(): Promise<ZAI> {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { query, num } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required and must be a string' }, { status: 400 });
    }
    if (query.length > 1000) {
      return NextResponse.json({ error: 'query exceeds maximum length of 1000 characters' }, { status: 400 });
    }
    if (num !== undefined && (typeof num !== 'number' || !Number.isInteger(num) || num < 1 || num > 50)) {
      return NextResponse.json({ error: 'num must be an integer between 1 and 50' }, { status: 400 });
    }

    const zai = await getZAI();

    const results = await zai.functions.invoke('web_search', {
      query,
      num: num || 8,
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
