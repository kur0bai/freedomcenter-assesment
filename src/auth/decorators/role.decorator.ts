import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';

//basic decorator to set roles
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
