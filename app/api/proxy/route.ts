import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Url parameter is required', { status: 400 });
  }

  if (url.startsWith('/')) {
    return NextResponse.redirect(new URL(url, request.nextUrl.origin));
  }

  // Security: Only allow proxying images from Supabase
  const allowedHost = 'sjqoinxhewxxbcczliyl.supabase.co';
  try {
    const targetUrl = new URL(url);
    if (targetUrl.hostname !== allowedHost) {
      if (!['images.unsplash.com'].includes(targetUrl.hostname)) {
        return new NextResponse('Forbidden Host', { status: 403 });
      }
    }
  } catch (e) {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  try {
    const data = await fetch(url, {
      headers: {
        // Forward relevant headers if needed, or keeping it simple
      },
    });

    if (!data.ok) {
      return new NextResponse('Failed to fetch image', { status: data.status });
    }

    const contentType = data.headers.get('Content-Type') || 'application/octet-stream';
    const blob = await data.blob();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
