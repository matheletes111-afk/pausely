import type {
  User,
  Profile,
  ImpulseType,
  UrgeSession,
  AIMessage,
  Streak,
  Subscription,
  Organization,
  OrganizationUser,
  ImpulseTypeEnum,
  UrgeOutcome,
  SubscriptionStatus,
  SubscriptionPlan,
  UserRole,
} from '@pausely/db';

export type {
  User,
  Profile,
  ImpulseType,
  UrgeSession,
  AIMessage,
  Streak,
  Subscription,
  Organization,
  OrganizationUser,
  ImpulseTypeEnum,
  UrgeOutcome,
  SubscriptionStatus,
  SubscriptionPlan,
  UserRole,
};

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
  refreshToken: string;
}

export interface CreateUrgeSessionRequest {
  impulseTypeId: string;
  timerMinutes?: number;
}

export interface UrgeSessionResponse extends UrgeSession {
  impulseType: ImpulseType;
  aiMessages: AIMessage[];
}

export interface AIMessageRequest {
  sessionId: string;
  content: string;
}

export interface AIMessageResponse extends AIMessage {
  session: UrgeSession;
}

export interface StreakResponse extends Streak {
  user: Pick<User, 'id' | 'email'>;
}

export interface UpdateStreakRequest {
  outcome: UrgeOutcome;
}

export interface SubscriptionResponse extends Subscription {
  user: Pick<User, 'id' | 'email'>;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
}

export interface OrganizationResponse extends Organization {
  organizationUsers: (OrganizationUser & {
    user: Pick<User, 'id' | 'email'>;
  })[];
}

export interface AssignUserToOrgRequest {
  userId: string;
  role?: UserRole;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

