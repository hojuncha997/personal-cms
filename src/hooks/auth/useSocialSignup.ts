import { useAuthStore } from '@/store/useAuthStore';
import { fetchClient } from '@/lib/fetchClient';
import { SocialProvider } from '@/types/authTypes';
import { useState } from 'react';

export default function useSocialSignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signUp = async (provider: SocialProvider) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetchClient(`/auth/social/${provider}/url`, { skipAuth: true });
            const { url } = await response.json();
            
            if (!url) {
                throw new Error('인증 URL을 가져오는데 실패했습니다.');
            }

            window.location.href = url;
        } catch (error) {
            console.error(`${provider} sign up failed:`, error);
            setError('소셜 로그인 연동 중 오류가 발생했습니다.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signUp,
        isLoading,
        error
    };
}