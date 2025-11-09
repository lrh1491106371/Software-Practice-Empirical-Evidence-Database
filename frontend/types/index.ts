export enum UserRole {
  SUBMITTER = 'submitter',
  MODERATOR = 'moderator',
  ANALYST = 'analyst',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}

export interface Article {
  _id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  doi?: string;
  journalName?: string;
  volume?: string;
  pages?: string;
  abstract?: string;
  url?: string;
  status: string;
  submittedBy: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Evidence {
  _id: string;
  articleId: Article | string;
  sePractice: string;
  claim: string;
  evidenceResult: 'supports' | 'opposes' | 'neutral';
  researchType: string;
  participantType: string;
  participantCount?: number;
  summary?: string;
  notes?: string;
  analyzedBy: User | string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

