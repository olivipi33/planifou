import makeFetchCookie from 'fetch-cookie';

export interface AuthData {
  host: string,
  token: string,
  log1: string
}

export interface SuccessLogin {
  status: 'success',
  errors: Record<string, string>,
  data: AuthData
}

export interface FailLogin {
  status: 'error',
  errors: Record<string, string>,
  data: []
}

export const loginPlanitou = async (username: string, password: string) => {
  const login_endpoint = "https://planitou.ca/ext_auth/login.process.php";

  const headers = {
    "accept": "*/*",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "Referer": "https://planitou.ca/ext_auth/login.php"
  };

  const response = await fetch(login_endpoint, {
    method: 'POST',
    body: `user=${username}&pass=${password}`,
    headers
  });

  if (!response.ok) {
    const error: FailLogin = {
      status: 'error',
      errors: { '403': 'Unauthorized' },
      data: []
    }
    return error;
  }

  return await response.json() as SuccessLogin;
}


export const getAPIToken = async (token: string) => {
  const api_endpoint = `https://310.planitou.ca/?tk3=${token}`;

  const headers = {
    "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://310.planitou.ca/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const fetchCookie = makeFetchCookie(fetch)

  const response = await fetchCookie(api_endpoint, {
    method: 'GET',
    headers,
    credentials: 'include'
  });

  const cookies = response.headers.get('set-cookie') ?? '';

  const regexp = new RegExp('[A-Za-z0-9-_]*\\.[A-Za-z0-9-_]*\\.[A-Za-z0-9-_]*');
  const match = cookies.match(regexp);

  if (match) {
    const jwtToken = match[0];
    return jwtToken;
  }
  console.log('JWT not found in the set-cookie header.');

  return undefined;
}