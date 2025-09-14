import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@store/useAuthStore';

/**
 * 알림 데이터 타입 정의
 */
interface Notification {
  id: number;
  type: 'COMMENT' | 'REPLY' | 'MENTION' | 'LIKE' | 'POST_PUBLISHED';
  title: string;
  content: string;
  referenceType: string;
  referenceId: number;
  referenceUrl?: string;
  isRead: boolean;
  createdAt: string;
  actor?: {
    uuid: string;
    nickname: string;
    profileImage?: string;
  };
}

interface UnreadNotificationsResponse {
  count: number;
  notifications: Notification[];
}

/**
 * 알림 폴링 커스텀 훅
 * 
 * 15초마다 서버에 알림을 확인하는 폴링 방식 구현
 * 로그인한 사용자만 폴링 시작
 * 페이지 포커스 상태에 따라 폴링 주기 조절
 * 
 * @returns 알림 상태와 관련 함수들
 */
export const useNotificationPolling = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(15000); // 기본 15초

  /**
   * 읽지 않은 알림 조회 API 호출
   */
  const fetchUnreadNotifications = async (): Promise<UnreadNotificationsResponse> => {
    if (!isAuthenticated) {
      console.log('인증되지 않은 사용자 - 알림 조회 스킵');
      return { count: 0, notifications: [] };
    }

    console.log('알림 조회 시작...');
    
    try {
      // zustand store에서 accessToken 가져오기
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken) {
        console.log('액세스 토큰이 없음 - 알림 조회 스킵');
        return { count: 0, notifications: [] };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/unread`, {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // JWT 토큰 추가
        },
      });

      console.log('알림 응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('알림 조회 실패:', errorText);
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      console.log('받은 알림 데이터:', data);
      
      return data;
    } catch (error) {
      console.error('알림 조회 에러:', error);
      throw error;
    }
  };

  /**
   * React Query를 사용한 폴링 구현
   * 
   * - refetchInterval: 폴링 주기
   * - refetchIntervalInBackground: 백그라운드에서도 폴링 유지
   * - enabled: 인증 상태와 폴링 활성화 상태 체크
   */
  const {
    data: notificationData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: fetchUnreadNotifications,
    refetchInterval: isPollingEnabled ? pollingInterval : false,
    refetchIntervalInBackground: false, // 백그라운드에서는 폴링 중지
    enabled: isAuthenticated && isPollingEnabled,
    staleTime: 10000, // 10초간 캐시 유지
  });

  /**
   * 페이지 포커스 상태에 따른 폴링 주기 조절
   * 
   * - 포커스: 15초 주기로 빠른 폴링
   * - 블러: 60초 주기로 느린 폴링
   */
  useEffect(() => {
    const handleFocus = () => {
      console.log('페이지 포커스 - 빠른 폴링 시작');
      setPollingInterval(15000); // 15초
      setIsPollingEnabled(true);
      refetch(); // 즉시 한번 조회
    };

    const handleBlur = () => {
      console.log('페이지 블러 - 느린 폴링으로 전환');
      setPollingInterval(60000); // 60초
    };

    // 페이지 가시성 API 사용
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      } else {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  /**
   * 특정 알림을 읽음 처리
   * 
   * @param notificationId - 읽음 처리할 알림 ID
   */
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken) {
        console.error('액세스 토큰이 없음');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // JWT 토큰 추가
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // 읽음 처리 후 알림 목록 새로고침
      refetch();
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  }, [refetch]);

  /**
   * 모든 알림을 읽음 처리
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken) {
        console.error('액세스 토큰이 없음');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // JWT 토큰 추가
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // 모두 읽음 처리 후 알림 목록 새로고침
      refetch();
    } catch (error) {
      console.error('모두 읽음 처리 실패:', error);
    }
  }, [refetch]);

  /**
   * 폴링 일시 중지/재개
   */
  const pausePolling = useCallback(() => {
    setIsPollingEnabled(false);
  }, []);

  const resumePolling = useCallback(() => {
    setIsPollingEnabled(true);
    refetch(); // 재개 시 즉시 조회
  }, [refetch]);

  return {
    // 알림 데이터
    unreadCount: notificationData?.count || 0,
    notifications: notificationData?.notifications || [],
    
    // 상태
    isLoading,
    error,
    isPollingEnabled,
    
    // 액션
    markAsRead,
    markAllAsRead,
    pausePolling,
    resumePolling,
    refetch,
  };
};