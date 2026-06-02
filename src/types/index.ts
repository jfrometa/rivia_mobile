// Enums from Prisma schema
export enum AppraisalStatus {
  IN_PROCESS = 'in_process',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  PENDING_REVIEW = 'pending_review',
  REVIEWED = 'reviewed',
  COMPLETED = 'completed',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ReferenceType {
  APPRAISAL = 'APPRAISAL',
  REFERENCE = 'REFERENCE',
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  OFFICE = 'office',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  CAR = 'car',
}

// Models
export interface Tenant {
  id: string;
  name: string;
  description?: string;
}

export interface Client {
  id: number;
  tenantId: string;
  name: string;
  description?: string;
  fields: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  tenantId: string;
  name?: string;
  phone?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  status: UserStatus;
  roles: Role[];
  signatureDocumentId?: string;
  userSettings: Record<string, any>;
}

export interface Appraisal {
  id: string;
  tenantId: string;
  fields: Record<string, any>;
  propertyType: string;
  createdAt: Date;
  updatedAt: Date;
  assignToId?: string;
  completedById?: string;
  createdById: string;
  revisedById?: string;
  status: AppraisalStatus;
  revisedAt?: Date;
  completedAt?: Date;
  applicantId: number;
  contactId: number;
  applicant?: Client;
  assignTo?: User;
  completedBy?: User;
  contact?: Client;
  createdBy?: User;
  revisedBy?: User;
}

export interface ComparisonReference {
  id: string;
  tenantId: string;
  fields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  referenceType: ReferenceType;
  propertyType?: PropertyType;
  sourceAppraisalId?: string;
  sourceAppraisalStatus?: string;
  orderIndex: number;
  clientId?: number;
  code?: string;
  client?: Client;
  sourceAppraisal?: Appraisal;
  assignTo?: User;
}

export interface AppraisalReference {
  id: string;
  appraisalId: string;
  comparisonReferenceId?: string;
  createdAt: Date;
  updatedAt: Date;
  orderIndex: number;
  fields: Record<string, any>;
  propertyType?: PropertyType;
  code?: string;
  appraisal?: Appraisal;
  comparisonReference?: ComparisonReference;
}

export interface Document {
  id: string;
  path: string;
  type: string;
  appraisalId?: string;
  comparisonReferenceId?: string;
  meta: Record<string, any>;
  orderIndex: number;
  appraisal?: Appraisal;
  comparition?: ComparisonReference;
}

export interface AppraisalComment {
  id: string;
  content: string;
  appraisalId: string;
  authorId: string;
  assignedToId?: string;
  createdAt: Date;
  dismissedAt?: Date;
  readAt?: Date;
  appraisal?: Appraisal;
  assignedTo?: User;
  author?: User;
}

export interface AppraisalHistory {
  id: string;
  action: string;
  description?: string;
  createdAt: Date;
  appraisalId: string;
  userId: string;
  appraisal?: Appraisal;
  user?: User;
}
