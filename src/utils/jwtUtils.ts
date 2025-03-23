// src/utils/jwtUtils.ts

import { logger } from '@/utils/logger';

// JWT 토큰 관련 사용자 정의 에러 클래스
export class TokenError extends Error {
  constructor(
    message: string, 
    public code: 'INVALID_FORMAT' | 'EXPIRED' | 'INVALID_PAYLOAD'
  ) {
    super(message);
    this.name = 'TokenError';
  }
 }
 
 // 토큰 관련 상수 정의
 export const TOKEN_CONSTANTS = {
  EXPIRY_THRESHOLD: 60 * 1000, // 만료 1분 전 경고를 위한 임계값
  REQUIRED_CLAIMS: ['sub', 'role', 'tokenVersion', 'keepLoggedIn', 'exp'] as const, // 필수 클레임 목록
  ALLOWED_ROLES: ['USER', 'ADMIN'] as const // 허용된 역할 목록
 } as const;
 
 // 디코딩된 JWT 토큰의 타입 정의
 interface DecodedToken {
  sub: string;
  role: string;
  tokenVersion: number;
  keepLoggedIn: boolean;
  iat: number; // 토큰 발급 시간 (issued at)
  exp: number; // 토큰 만료 시간 (expiration)
 }
 
 /**
 * JWT 토큰을 디코딩하고 페이로드를 검증하는 함수
 * @param token JWT 토큰 문자열
 * @returns 디코딩된 토큰 페이로드
 * @throws TokenError 토큰이 유효하지 않을 경우
 */
 export function getTokenPayload(token: string): DecodedToken {
  try {
    // JWT 토큰 형식 검증 (header.payload.signature)
    if (!token || !token.includes('.') || token.split('.').length !== 3) {
      throw new TokenError('Invalid token format', 'INVALID_FORMAT');
    }
 
    const [, payload] = token.split('.');
    
    // base64url을 일반 base64로 변환 후 디코딩
    // URL 안전 문자(-_)를 base64 문자(+/)로 변환
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(
      decodeURIComponent(
        atob(base64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      )
    );

    if (process.env.NODE_ENV === 'development') {
      logger.info('=== Token Payload Debug ===');
      logger.info('Raw token:', token);
      logger.info('Decoded payload:', decodedPayload);
      logger.info('Required fields check:');
      logger.info('- exp:', decodedPayload.exp);
      logger.info('- sub:', decodedPayload.sub);
      logger.info('- role:', decodedPayload.role);
      logger.info('- tokenVersion:', decodedPayload.tokenVersion);
      logger.info('- keepLoggedIn:', decodedPayload.keepLoggedIn);
      logger.info('========================');
    }
 
    // 필수 클레임 존재 여부 검증
    if (!decodedPayload.exp || !decodedPayload.sub || !decodedPayload.role || 
        typeof decodedPayload.tokenVersion !== 'number' || 
        typeof decodedPayload.keepLoggedIn !== 'boolean') {
      throw new TokenError('Missing required token claims', 'INVALID_PAYLOAD');
    }
 
    // 페이로드 타입 검증
    validateTokenPayload(decodedPayload);
 
    logger.info('Decoded token payload:', JSON.stringify(decodedPayload));
    return decodedPayload;
  } catch (error) {
    logger.error('Token decoding failed:', error);
    throw error instanceof TokenError ? error : new TokenError('Invalid token', 'INVALID_FORMAT');
  }
 }
 
 /**
 * 페이로드가 DecodedToken 타입과 일치하는지 검증하는 타입 가드 함수
 * @param payload 검증할 페이로드 객체
 * @throws Error 페이로드 구조가 유효하지 않을 경우
 */
 function validateTokenPayload(payload: any): asserts payload is DecodedToken {
  // 필수 필드만 엄격하게 체크
  if (
    typeof payload.sub !== 'string' ||
    typeof payload.role !== 'string' ||
    typeof payload.tokenVersion !== 'number' ||
    typeof payload.keepLoggedIn !== 'boolean' ||
    typeof payload.exp !== 'number'
  ) {
    throw new TokenError('Invalid token payload structure', 'INVALID_PAYLOAD');
  }
 }
 
 /**
 * 토큰이 만료되었는지 확인하는 함수
 * @param exp 토큰의 만료 시간 (초 단위)
 * @returns 만료 여부
 */
 export function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
 }
 
 /**
 * 토큰의 만료 시간을 밀리초 단위로 변환하는 함수
 * @param exp 토큰의 만료 시간 (초 단위)
 * @returns 밀리초 단위의 만료 시간
 */
 export function getTokenExpiryTime(exp: number): number {
  return exp * 1000;
 }
 
 /**
 * 토큰의 남은 유효 시간을 계산하는 함수
 * @param exp 토큰의 만료 시간 (초 단위)
 * @returns 밀리초 단위의 남은 시간 (최소 0)
 */
 export function getRemainingTime(exp: number): number {
  return Math.max(0, exp * 1000 - Date.now());
 }


// // JWT 토큰 관련 유틸리티
// // - JWT 토큰 디코딩
// // - 실제 만료 시간 추출 (exp claim)
// // - 밀리초 단위로 변환

// interface DecodedToken {
//   email: string;
//   sub: string;
//   role: string;
//   preferences: {
//     theme: string;
//     language: string;
//     timezone: string;
//   };
//   tokenVersion: number;
//   keepLoggedIn: boolean;
//   iat: number;
//   exp: number;
//   // [key: string]: any;
// }

// /* 
// decodedPayload from jwtUtils: {"email":"postman5@example.com","sub":"0e355250-cb15-45df-a396-1c1b34514638","role":"USER","preferences":{"theme":"light","language":"ko","timezone":"UTC"},"tokenVersion":7,"keepLoggedIn":true,"iat":1736242893,"exp":1736243793}

// */
// export function getTokenPayload(token: string): DecodedToken {
//   try {
//     // JWT는 'header.payload.signature' 형식입니다
//     const payload = token.split('.')[1];
//     // base64 디코딩
//     const decodedPayload: DecodedToken = JSON.parse(atob(payload));
//     console.log('decodedPayload from jwtUtils: ' + JSON.stringify(decodedPayload))
//     // exp는 초 단위이므로 밀리초로 변환
//     // return decodedPayload.exp * 1000;
//     return decodedPayload;
//   } catch (error) {
//     console.error('토큰 디코딩 실패:', error);
//     throw new Error('유효하지 않은 토큰 형식입니다.');
//   }
// } 