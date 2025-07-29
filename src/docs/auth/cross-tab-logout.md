# 크로스 탭 로그아웃 구현

## 관련 파일
- src/lib/auth/crossTabAuth.ts
- src/hooks/auth/useLogout.ts
- src/components/navigation/nav-profile.tsx
- src/components/layouts/ClientRootLayout.tsx

## 구현 설명
1. 각 탭은 독립적인 메모리 공간을 가짐
2. 한 탭에서 로그아웃 시 다른 탭들에도 알림 필요
3. BroadcastChannel API (모던 브라우저) 또는 localStorage (폴백) 사용

## 코드 흐름
1. 사용자 로그아웃 액션 (nav-profile.tsx)
2. 백엔드 로그아웃 요청 (useLogout.ts)
3. 성공 시 크로스 탭 로그아웃 트리거 (crossTabAuth.ts)
4. 모든 탭에서 로그아웃 처리

## 주요 코드
[관련 코드 스니펫 포함]

## 참고 사항
- 각 탭은 독립적인 JavaScript 실행 컨텍스트를 가짐
- 메모리 내 상태(Zustand store 등)는 탭 간 공유되지 않음
- localStorage, cookies는 같은 출처의 탭들이 공유 