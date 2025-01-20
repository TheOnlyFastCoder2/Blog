import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router';

interface IProps extends PropsWithChildren {
  isValidRoutes: Array<string>
  isInverted?: boolean
}

export default function ({ isValidRoutes, children , isInverted = false}: IProps) {
  const location = useLocation();
  const isValid = isValidRoutes.includes(location.pathname);

  if(isInverted) {
    return !isValid ? children : null;
  }

  return isValid ? children : null;
};
