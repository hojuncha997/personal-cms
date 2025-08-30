'use client'

import React, { useState } from 'react';
import { useGetComments } from '@/hooks/posts/useGetComments';
import { useCreateComment } from '@/hooks/posts/useCreateComment';
import { useUpdateComment } from '@/hooks/posts/useUpdateComment';
import { useDeleteComment } from '@/hooks/posts/useDeleteComment';
import { useAuthStore } from '@/store/useAuthStore';
import { useIsAuthor } from '@/hooks/auth/useIsAuthor';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { User, Trash2, MessageCircle, Edit3 } from 'lucide-react';
import { CommentInput } from './CommentInput';

interface CommentSectionProps {
  publicId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ publicId }) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  
  const { isAuthenticated } = useAuthStore();
  const { data: commentsData, isLoading } = useGetComments(publicId, page);
  const { mutate: createComment, isPending: isCreating } = useCreateComment(publicId);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(publicId);
  const { mutate: deleteComment } = useDeleteComment(publicId);

  const handleSubmitComment = (content: string) => {
    createComment({ content });
  };

  const handleSubmitReply = (content: string, parentCommentId: number) => {
    createComment(
      { content, parentCommentId },
      {
        onSuccess: () => {
          setReplyingTo(null);
        }
      }
    );
  };

  const handleUpdateComment = (content: string, commentId: number) => {
    updateComment(
      { commentId, content },
      {
        onSuccess: () => {
          setEditingComment(null);
        }
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteComment(commentId);
    }
  };

  const CommentItem = ({ comment, isReply = false }: any) => {
    const isAuthor = useIsAuthor(comment.member.uuid);
    
    return (
    <div className={`${isReply ? 'ml-12' : ''} mb-4`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {comment.member.profileImage ? (
            <Image
              src={comment.member.profileImage}
              alt={comment.member.nickname}
              width={isReply ? 32 : 40}
              height={isReply ? 32 : 40}
              className="rounded-full"
            />
          ) : (
            <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} bg-gray-200 rounded-full flex items-center justify-center`}>
              <User className={`${isReply ? 'w-4 h-4' : 'w-5 h-5'} text-gray-500`} />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{comment.member.nickname}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MM월 dd일 HH:mm', { locale: ko })}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-400">(수정됨)</span>
                )}
              </div>
              
              {isAuthenticated && isAuthor && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingComment(comment.id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="댓글 수정"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="댓글 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
            </div>
            
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
          
          {editingComment === comment.id ? (
            <div className="mt-2">
              <CommentInput
                onSubmit={(content) => handleUpdateComment(content, comment.id)}
                isLoading={isUpdating}
                placeholder="댓글을 수정하세요..."
                showCancel={true}
                onCancel={() => setEditingComment(null)}
                size="small"
                initialValue={comment.content}
              />
            </div>
          ) : (
            !isReply && isAuthenticated && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                답글 달기
              </button>
            )
          )}
          
          {replyingTo === comment.id && (
            <div className="mt-2">
              <CommentInput
                onSubmit={(content) => handleSubmitReply(content, comment.id)}
                isLoading={isCreating}
                placeholder="답글을 입력하세요..."
                showCancel={true}
                onCancel={() => setReplyingTo(null)}
                size="small"
              />
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply: any) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">
        댓글 {commentsData?.meta.total || 0}개
      </h3>
      
      <div className="mb-6">
        <CommentInput
          onSubmit={handleSubmitComment}
          isLoading={isCreating}
          placeholder="댓글을 입력하세요..."
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          댓글을 불러오는 중...
        </div>
      ) : commentsData?.comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {commentsData?.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          
          {commentsData && commentsData.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: commentsData.meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    page === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};