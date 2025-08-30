'use client'

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { User, Send } from 'lucide-react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  size?: 'default' | 'small';
  initialValue?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  isLoading,
  placeholder = "댓글을 입력하세요...",
  showCancel = false,
  onCancel,
  size = 'default',
  initialValue = ''
}) => {
  const [text, setText] = useState(initialValue);
  const { isAuthenticated, nickname, profile } = useAuthStore();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        댓글을 작성하려면 로그인이 필요합니다.
      </div>
    );
  }

  const avatarSize = size === 'small' ? 32 : 40;
  const avatarClass = size === 'small' ? 'w-8 h-8' : 'w-10 h-10';
  const iconClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {profile?.profileImage ? (
          <Image
            src={profile.profileImage}
            alt={nickname || ''}
            width={avatarSize}
            height={avatarSize}
            className="rounded-full"
          />
        ) : (
          <div className={`${avatarClass} bg-gray-200 rounded-full flex items-center justify-center`}>
            <User className={`${iconClass} text-gray-500`} />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          rows={size === 'small' ? 1 : 2}
        />
        <div className="flex flex-col gap-1">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
            {size === 'default' && <span>등록</span>}
          </button>
          {showCancel && onCancel && (
            <button
              onClick={() => {
                onCancel();
                setText('');
              }}
              className="px-3 py-1 text-gray-500 hover:text-gray-700 text-sm"
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};