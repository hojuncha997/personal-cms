'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationPolling } from '@hooks/notifications/useNotificationPolling';
import { NotificationModal } from './NotificationModal';

/**
 * 알림 벨 컴포넌트
 * 
 * 헤더에 표시되는 알림 벨 아이콘
 * - 읽지 않은 알림 개수를 뱃지로 표시
 * - 클릭 시 알림 목록 모달 표시
 * - 15초마다 자동으로 알림 확인 (폴링)
 */
export const NotificationBell = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    unreadCount, 
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    pausePolling,
    resumePolling,
  } = useNotificationPolling();

  /**
   * 모달 열기
   * 모달이 열려있는 동안은 폴링 일시중지 (서버 부하 감소)
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
    pausePolling();
  };

  /**
   * 모달 닫기
   * 모달을 닫으면 폴링 재개
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resumePolling();
  };

  /**
   * 알림 클릭 처리
   * - 읽음 처리
   * - 해당 페이지로 이동
   * - 모달 닫기
   */
  const handleNotificationClick = async (notification: any) => {
    // 읽음 처리
    await markAsRead(notification.id);
    
    // 참조 URL이 있으면 해당 페이지로 이동
    if (notification.referenceUrl) {
      window.location.href = notification.referenceUrl;
    }
    
    // 모달 닫기
    handleCloseModal();
  };

  return (
    <>
      {/* 알림 벨 버튼 */}
      <button
        onClick={handleOpenModal}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label={`알림 ${unreadCount > 0 ? `(${unreadCount}개)` : ''}`}
      >
        <Bell 
          size={20} 
          className="text-gray-600 dark:text-gray-400"
        />
        
        {/* 읽지 않은 알림 뱃지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* 로딩 인디케이터 (첫 로딩 시) */}
        {isLoading && unreadCount === 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* 알림 목록 모달 */}
      {isModalOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={handleCloseModal}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </>
  );
};