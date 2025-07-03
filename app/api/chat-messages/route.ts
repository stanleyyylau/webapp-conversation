import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { checkTokenAvailability } from '@/app/api/utils/llm-token'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body
  const { user } = getInfo(request)

  // 检查当前站点有没有 token
  const tokenCheck = checkTokenAvailability(inputs)
  if (!tokenCheck.hasToken) {
    return new Response(JSON.stringify({
      error: 'Insufficient tokens',
      message: tokenCheck.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)
  return new Response(res.data as any)
}
