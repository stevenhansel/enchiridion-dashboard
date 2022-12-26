import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const usePermission = (...permissions: string[]) => {
  const profile = useSelector((state: RootState) => state.profile);

  const userPermissions = useMemo(() => {
    if (profile === null) return [];

    return profile.role.permissions.map(({ value }) => value);
  }, [profile]);

  const hasPermission = useMemo(() => {
    if (userPermissions.length === 0) return false;

    return permissions.every(p => userPermissions.includes(p));
  }, [userPermissions, permissions]);

  return hasPermission;
};

export default usePermission;
