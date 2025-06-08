import { NextRequest, NextResponse } from 'next/server';
import { auth0Config } from '@/lib/auth0-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  console.log('Auth action:', action);

  if (action === 'login') {
    console.log('Starting login flow');
    console.log('Auth0 config:', {
      issuerBaseURL: auth0Config.issuerBaseURL,
      clientID: auth0Config.clientID,
      baseURL: auth0Config.baseURL,
      callback: auth0Config.routes.callback,
    });

    const loginUrl = new URL('/authorize', auth0Config.issuerBaseURL);
    loginUrl.searchParams.set('client_id', auth0Config.clientID!);
    loginUrl.searchParams.set('redirect_uri', `${auth0Config.baseURL}${auth0Config.routes.callback}`);
    loginUrl.searchParams.set('response_type', 'code');
    loginUrl.searchParams.set('scope', 'openid profile email');
    loginUrl.searchParams.set('state', crypto.randomUUID());

    console.log('Redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl.toString());
  }

  if (action === 'logout') {
    console.log('Starting logout flow');
    const logoutUrl = new URL('/v2/logout', auth0Config.issuerBaseURL);
    logoutUrl.searchParams.set('client_id', auth0Config.clientID!);
    logoutUrl.searchParams.set('returnTo', auth0Config.baseURL);
    console.log('Redirecting to:', logoutUrl.toString());
    return NextResponse.redirect(logoutUrl.toString());
  }

  console.log('Invalid action:', action);
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
} 