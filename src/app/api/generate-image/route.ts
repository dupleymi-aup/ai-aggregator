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
    const SIZE_OPTIONS = ['1024x1024', '1024x1792', '1792x1024', '768x768', '768x1344', '1344x768'];

    const { prompt, size } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required and must be a string' }, { status: 400 });
    }
    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'prompt exceeds maximum length of 4000 characters' }, { status: 400 });
    }
    if (size !== undefined && !SIZE_OPTIONS.includes(size)) {
      return NextResponse.json({ error: `size must be one of: ${SIZE_OPTIONS.join(', ')}` }, { status: 400 });
    }

    const zai = await getZAI();

    const response = await zai.images.generations.create({
      prompt,
      size: size || '1024x1024',
    });

    const imageBase64 = response.data[0]?.base64;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Image generation failed' },
      { status: 500 }
    );
  }
}
