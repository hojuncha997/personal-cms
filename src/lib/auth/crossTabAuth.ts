import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { logger } from '@/utils/logger';
export class CrossTabAuth {
  // 브라우저의 BroadcastChannel API를 사용하기 위한 채널 인스턴스
  private static channel: BroadcastChannel | null = null;
  // BroadcastChannel이 지원되지 않을 경우 localStorage 사용 여부
  private static fallbackEnabled = false;

  static init() {
    try {
      // 모던 브라우저에서는 BroadcastChannel을 통한 탭 간 통신 사용
      this.channel = new BroadcastChannel('auth');
      this.channel.onmessage = this.handleAuthEvent.bind(this);
    } catch (e) {
      // BroadcastChannel을 지원하지 않는 브라우저를 위한 폴백
      logger.info('BroadcastChannel not supported, falling back to localStorage');
      this.fallbackEnabled = true;
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }

  static logout() {
    // 모든 탭에 로그아웃 이벤트 브로드캐스트
    if (this.channel) {
      this.channel.postMessage({ type: 'LOGOUT' });
    }
    if (this.fallbackEnabled) {
      localStorage.setItem('logout-event', Date.now().toString());
    }
    // 현재 탭에서도 로그아웃 처리
    this.handleLogout();
  }

  private static handleAuthEvent(event: MessageEvent) {
    // BroadcastChannel을 통해 받은 로그아웃 메시지 처리
    if (event.data.type === 'LOGOUT') {
      this.handleLogout();
    }
  }

  private static handleStorageEvent(event: StorageEvent) {
    // localStorage 변경을 통해 받은 로그아웃 이벤트 처리
    if (event.key === 'logout-event') {
      this.handleLogout();
    }
  }

  private static handleLogout() {
    // Zustand 스토어의 상태 초기화
    const store = useAuthStore.getState();
    store.resetAuthState();
    store.setLoading(false);
    
    // 로그아웃 이벤트 클린업
    localStorage.removeItem('logout-event');
  }

  static cleanup() {
    // 컴포넌트 언마운트 시 리소스 정리
    if (this.channel) {
      this.channel.close();
    }
    if (this.fallbackEnabled) {
      window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }
} 