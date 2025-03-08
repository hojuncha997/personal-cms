import { useAuthStore } from '@/store/useAuthStore';
import { ReactNode } from 'react';

interface AdminGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
    const role = useAuthStore(state => state.role);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (!isAuthenticated || role !== 'ADMIN') {
        return fallback;
    }

    return <>{children}</>;
} 