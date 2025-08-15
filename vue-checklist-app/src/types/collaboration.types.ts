export interface TeamMember {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  avatar?: string
  status: 'active' | 'pending' | 'inactive'
  joinedAt: Date
  lastActiveAt?: Date
  permissions: TeamPermissions
}

export interface TeamPermissions {
  canCreateChecklists: boolean
  canEditChecklists: boolean
  canDeleteChecklists: boolean
  canCompleteT asks: boolean
  canAssignTasks: boolean
  canInviteMembers: boolean
  canManageTeam: boolean
  canViewReports: boolean
}

export interface Team {
  id: string
  name: string
  description?: string
  members: TeamMember[]
  ownerId: string
  createdAt: Date
  updatedAt: Date
  settings: TeamSettings
  subscription?: TeamSubscription
}

export interface TeamSettings {
  allowGuestAccess: boolean
  requireApproval: boolean
  defaultRole: 'member' | 'viewer'
  notifications: {
    taskAssigned: boolean
    taskCompleted: boolean
    checklistShared: boolean
    memberJoined: boolean
  }
}

export interface TeamSubscription {
  plan: 'free' | 'pro' | 'enterprise'
  maxMembers: number
  features: string[]
  billingCycle?: 'monthly' | 'yearly'
  expiresAt?: Date
}

export interface SharedChecklist {
  id: string
  checklistId: string
  teamId: string
  sharedBy: string
  sharedWith: string[] // team member ids
  permissions: ChecklistPermissions
  sharedAt: Date
  expiresAt?: Date
}

export interface ChecklistPermissions {
  canView: boolean
  canEdit: boolean
  canDelete: boolean
  canComplete: boolean
  canAssign: boolean
  canComment: boolean
}

export interface TaskAssignment {
  taskId: string
  assignedTo: string // member id
  assignedBy: string // member id
  assignedAt: Date
  dueDate?: Date
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  notes?: string
}

export interface TeamActivity {
  id: string
  teamId: string
  memberId: string
  memberName: string
  action: TeamActionType
  target?: string // checklist or task id
  targetName?: string
  details?: string
  timestamp: Date
}

export type TeamActionType = 
  | 'member_joined'
  | 'member_left'
  | 'member_invited'
  | 'checklist_created'
  | 'checklist_shared'
  | 'checklist_completed'
  | 'task_assigned'
  | 'task_completed'
  | 'task_updated'
  | 'comment_added'
  | 'role_changed'

export interface TeamComment {
  id: string
  checklistId: string
  taskId?: string
  authorId: string
  authorName: string
  content: string
  mentions?: string[] // member ids
  attachments?: CommentAttachment[]
  createdAt: Date
  updatedAt?: Date
  isEdited: boolean
}

export interface CommentAttachment {
  id: string
  type: 'image' | 'file'
  name: string
  url: string
  size: number
  mimeType: string
}

export interface TeamInvite {
  id: string
  teamId: string
  teamName: string
  invitedBy: string
  invitedEmail: string
  role: 'admin' | 'member' | 'viewer'
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  token: string
  createdAt: Date
  expiresAt: Date
  acceptedAt?: Date
}

export interface CollaborationNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'task_overdue'
  | 'checklist_shared'
  | 'comment_mention'
  | 'team_invite'
  | 'member_joined'
  | 'role_changed'

export interface TeamStats {
  totalMembers: number
  activeMembers: number
  totalChecklists: number
  completedChecklists: number
  totalTasks: number
  completedTasks: number
  overdueT asks: number
  averageCompletionTime: number
  topPerformers: TeamMember[]
  recentActivity: TeamActivity[]
}

export interface CollaborationFilter {
  teamId?: string
  memberId?: string
  status?: string
  role?: string
  dateFrom?: Date
  dateTo?: Date
  searchQuery?: string
}