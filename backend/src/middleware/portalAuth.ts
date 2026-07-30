import { Response, NextFunction } from 'express';
import { AuthRequest, requireRole } from '../middleware/auth';
import { CUSTOMER_ROLES, EMPLOYEE_PORTAL_ROLES, isAdminRole } from '../lib/roles';

export const requireCustomer = requireRole(...CUSTOMER_ROLES);

export const requireEmployee = requireRole(...EMPLOYEE_PORTAL_ROLES);

export const requireAdminOrStaff = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (isAdminRole(req.user.role) || EMPLOYEE_PORTAL_ROLES.includes(req.user.role as never)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden' });
};
