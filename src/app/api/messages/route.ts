import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, role, content, provider, model, promptTokens, completionTokens, totalTokens } = body;

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json({ error: 'conversationId is required and must be a string' }, { status: 400 });
    }
    if (!role || !['user', 'assistant', 'system'].includes(role)) {
      return NextResponse.json({ error: 'role must be one of: user, assistant, system' }, { status: 400 });
    }
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'content is required and must be a string' }, { status: 400 });
    }
    if (content.length > 100_000) {
      return NextResponse.json({ error: 'content exceeds maximum length of 100,000 characters' }, { status: 400 });
    }
    if (provider && typeof provider !== 'string') return NextResponse.json({ error: 'provider must be a string' }, { status: 400 });
    if (model && typeof model !== 'string') return NextResponse.json({ error: 'model must be a string' }, { status: 400 });
    if (promptTokens && (typeof promptTokens !== 'number' || promptTokens < 0)) return NextResponse.json({ error: 'promptTokens must be a non-negative number' }, { status: 400 });
    if (completionTokens && (typeof completionTokens !== 'number' || completionTokens < 0)) return NextResponse.json({ error: 'completionTokens must be a non-negative number' }, { status: 400 });
    if (totalTokens && (typeof totalTokens !== 'number' || totalTokens < 0)) return NextResponse.json({ error: 'totalTokens must be a non-negative number' }, { status: 400 });

    const message = await db.message.create({
      data: {
        conversationId,
        role,
        content,
        provider: provider || null,
        model: model || null,
        promptTokens: promptTokens || 0,
        completionTokens: completionTokens || 0,
        totalTokens: totalTokens || 0,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
