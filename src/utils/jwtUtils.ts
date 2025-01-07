// JWT 토큰 관련 유틸리티
// - JWT 토큰 디코딩
// - 실제 만료 시간 추출 (exp claim)
// - 밀리초 단위로 변환

interface DecodedToken {
  email: string;
  sub: string;
  role: string;
  preferences: {
    theme: string;
    language: string;
    timezone: string;
  };
  tokenVersion: number;
  keepLoggedIn: boolean;
  iat: number;
  exp: number;
  // [key: string]: any;
}

/* 
decodedPayload from jwtUtils: {"email":"postman5@example.com","sub":"0e355250-cb15-45df-a396-1c1b34514638","role":"USER","preferences":{"theme":"light","language":"ko","timezone":"UTC"},"tokenVersion":7,"keepLoggedIn":true,"iat":1736242893,"exp":1736243793}

*/
export function getTokenPayload(token: string): DecodedToken {
  try {
    // JWT는 'header.payload.signature' 형식입니다
    const payload = token.split('.')[1];
    // base64 디코딩
    const decodedPayload: DecodedToken = JSON.parse(atob(payload));
    console.log('decodedPayload from jwtUtils: ' + JSON.stringify(decodedPayload))
    // exp는 초 단위이므로 밀리초로 변환
    // return decodedPayload.exp * 1000;
    return decodedPayload;
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    throw new Error('유효하지 않은 토큰 형식입니다.');
  }
} 