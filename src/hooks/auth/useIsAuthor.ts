import { useAuthStore } from '@/store/useAuthStore';

export const useIsAuthor = (authorUuid: string | undefined) => {
    // Selector 최적화로 필요한 값만 구독
    const sub = useAuthStore(state => state.sub);
    
    if (!sub || !authorUuid) {
        return false;
    }

    return sub === authorUuid;
}; 