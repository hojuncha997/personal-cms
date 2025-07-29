interface PublicFetchOptions extends RequestInit {
  baseURL?: string;
}

export const publicFetch = async (url: string, options: PublicFetchOptions = {}) => {
  const baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_URL;
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(fullUrl, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(error.message || '요청 처리 중 오류가 발생했습니다.');
  }

  return response.json();
}; 