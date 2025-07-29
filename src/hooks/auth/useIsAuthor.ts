import { useAuthStore } from '@/store/useAuthStore';

export const useIsAuthor = (authorUuid: string | undefined) => {
    const { sub } = useAuthStore();
    
    if (!sub || !authorUuid) {
        return false;
    }

    return sub === authorUuid;
}; 