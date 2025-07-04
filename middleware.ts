import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setSession } from './app/api/utils/common'

export async function middleware(request: NextRequest) {
    const dataset_id = request.nextUrl.searchParams.get('dataset_id')
    const sessionId = request.cookies.get('session_id')?.value

    // If dataset_id is provided in the URL, set it as the session_id cookie
    if (dataset_id) {
        const response = NextResponse.next()
        const cookieHeader = setSession(dataset_id)
        response.headers.set('Set-Cookie', cookieHeader['Set-Cookie'])
        return response
    }

    // If no dataset_id in URL and no session_id cookie, return an error
    if (!sessionId) {
        return NextResponse.json(
            { error: 'Invalid request: dataset_id is required or session_id cookie is missing.' },
            { status: 400 }
        )
    }

    // Otherwise, proceed with the request (sessionId already exists or dataset_id was processed)
    return NextResponse.next()
}

export const config = {
    matcher: '/',
} 