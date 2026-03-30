import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface GuestGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function GuestGuard({ children, requireAuth = true }: GuestGuardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, requireAuth, navigate]);

  return <>{children}</>;
}
