'use client';

import { useEffect, useRef } from 'react';
import { X, MessageCircle, Reply, AtSign, Heart, FileText, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

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

interface NotificationModalProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
}

/**
 * 알림 목록 모달 컴포넌트
 * 
 * 알림 벨을 클릭했을 때 표시되는 모달
 * - 알림 목록 표시
 * - 알림 타입별 아이콘 표시
 * - 읽음/읽지않음 상태 표시
 * - 모두 읽음 처리 기능
 */
export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onNotificationClick,
  onMarkAllAsRead,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * 모달 외부 클릭 시 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // ESC 키 누르면 닫기
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  /**
   * 알림 타입에 따른 아이콘 반환
   */
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'COMMENT':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'REPLY':
        return <Reply size={16} className="text-green-500" />;
      case 'MENTION':
        return <AtSign size={16} className="text-purple-500" />;
      case 'LIKE':
        return <Heart size={16} className="text-red-500" />;
      case 'POST_PUBLISHED':
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };

  /**
   * 시간 포맷팅 (예: "3분 전", "1시간 전")
   */
  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ko,
    });
  };

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* 모달 */}
      <div
        ref={modalRef}
        className="fixed top-16 right-4 w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 flex flex-col"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">알림</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* 모두 읽음 버튼 */}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="모두 읽음"
              >
                <CheckCheck size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}
            
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            // 알림이 없을 때
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Bell size={48} className="mb-4 opacity-20" />
              <p className="text-sm">새로운 알림이 없습니다</p>
            </div>
          ) : (
            // 알림 목록
            <div className="divide-y dark:divide-gray-700">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => onNotificationClick(notification)}
                  className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* 아이콘 */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      {/* 제목 */}
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-500 rounded-full" />
                        )}
                      </div>

                      {/* 내용 */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.content}
                      </p>

                      {/* 액터와 시간 */}
                      <div className="flex items-center gap-2 mt-2">
                        {notification.actor && (
                          <>
                            {notification.actor.profileImage ? (
                              <img
                                src={notification.actor.profileImage}
                                alt={notification.actor.nickname}
                                className="w-4 h-4 rounded-full"
                              />
                            ) : (
                              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.actor.nickname}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                          </>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 (필요시 추가) */}
        {notifications.length > 5 && (
          <div className="p-3 border-t dark:border-gray-700 text-center">
            <a
              href="/notifications"
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              모든 알림 보기
            </a>
          </div>
        )}
      </div>
    </>
  );
};

// Bell 아이콘이 없을 경우를 위한 간단한 Bell 컴포넌트
const Bell: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);