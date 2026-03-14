import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/ai-context'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const chat = model.startChat({
      history: (history ?? []).map((m: { role: string; text: string }) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    })

    const result = await chat.sendMessage(message)
    const text = result.response.text()

    return NextResponse.json({ reply: text })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
