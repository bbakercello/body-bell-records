import { cookies } from 'next/headers';
import { auth0Config } from '../auth0-config';

export async function isAdmin() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) return false;

  try {
    const userInfoResponse = await fetch(`${auth0Config.issuerBaseURL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      return false;
    }

    const userInfo = await userInfoResponse.json();
    return auth0Config.adminEmails.includes(userInfo.email);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
} 