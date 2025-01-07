// JWT 토큰 관련 유틸리티
// - JWT 토큰 디코딩
// - 실제 만료 시간 추출 (exp claim)
// - 밀리초 단위로 변환

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function getTokenExpiry(token: string): number {
  try {
    // JWT는 'header.payload.signature' 형식입니다
    const payload = token.split('.')[1];
    // base64 디코딩
    const decodedPayload = JSON.parse(atob(payload));
    console.log('decodedPayload from jwtUtils: ' + JSON.stringify(decodedPayload))
    // exp는 초 단위이므로 밀리초로 변환
    return decodedPayload.exp * 1000;
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    throw new Error('유효하지 않은 토큰 형식입니다.');
  }
} 