import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Team,
  TeamMember,
  SharedChecklist,
  TaskAssignment,
  TeamActivity,
  TeamComment,
  TeamInvite,
  CollaborationNotification,
  TeamStats,
  CollaborationFilter,
  TeamPermissions
} from '@/types/collaboration.types'
import { useLocalStorage } from '@vueuse/core'

export const useCollaborationStore = defineStore('collaboration', () => {
  // State
  const currentTeam = ref<Team | null>(null)
  const teams = ref<Team[]>([])
  const teamMembers = ref<TeamMember[]>([])
  const sharedChecklists = ref<SharedChecklist[]>([])
  const taskAssignments = ref<TaskAssignment[]>([])
  const teamActivities = ref<TeamActivity[]>([])
  const teamComments = ref<TeamComment[]>([])
  const teamInvites = ref<TeamInvite[]>([])
  const notifications = ref<CollaborationNotification[]>([])
  const currentUser = ref<TeamMember | null>(null)
  
  // Local Storage Persistence
  const storedTeams = useLocalStorage('teams', teams.value)
  const storedCurrentTeam = useLocalStorage('current-team', currentTeam.value)
  const storedNotifications = useLocalStorage('collaboration-notifications', notifications.value)
  
  // Load from storage
  teams.value = storedTeams.value
  currentTeam.value = storedCurrentTeam.value
  notifications.value = storedNotifications.value
  
  // Mock current user (in production, this would come from authentication)
  currentUser.value = {
    id: 'current-user',
    email: 'user@example.com',
    name: 'Current User',
    role: 'owner',
    status: 'active',
    joinedAt: new Date(),
    permissions: {
      canCreateChecklists: true,
      canEditChecklists: true,
      canDeleteChecklists: true,
      canCompleteTasks: true,
      canAssignTasks: true,
      canInviteMembers: true,
      canManageTeam: true,
      canViewReports: true
    }
  }
  
  // Computed
  const activeTeamMembers = computed(() => {
    if (!currentTeam.value) return []
    return currentTeam.value.members.filter(m => m.status === 'active')
  })
  
  const pendingInvites = computed(() => {
    return teamInvites.value.filter(i => i.status === 'pending')
  })
  
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read)
  })
  
  const myAssignments = computed(() => {
    if (!currentUser.value) return []
    return taskAssignments.value.filter(a => a.assignedTo === currentUser.value!.id)
  })
  
  const teamStats = computed<TeamStats>(() => {
    if (!currentTeam.value) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        totalChecklists: 0,
        completedChecklists: 0,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        averageCompletionTime: 0,
        topPerformers: [],
        recentActivity: []
      }
    }
    
    const now = new Date()
    const overdueTasks = taskAssignments.value.filter(a => 
      a.status !== 'completed' && a.dueDate && new Date(a.dueDate) < now
    ).length
    
    return {
      totalMembers: currentTeam.value.members.length,
      activeMembers: activeTeamMembers.value.length,
      totalChecklists: sharedChecklists.value.length,
      completedChecklists: sharedChecklists.value.filter(c => c.permissions.canComplete).length,
      totalTasks: taskAssignments.value.length,
      completedTasks: taskAssignments.value.filter(a => a.status === 'completed').length,
      overdueTasks,
      averageCompletionTime: 0, // Would calculate from task completion data
      topPerformers: activeTeamMembers.value.slice(0, 3),
      recentActivity: teamActivities.value.slice(0, 10)
    }
  })
  
  // Actions
  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  function createTeam(name: string, description?: string): Team {
    if (!currentUser.value) throw new Error('No authenticated user')
    
    const newTeam: Team = {
      id: generateId(),
      name,
      description,
      members: [currentUser.value],
      ownerId: currentUser.value!.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowGuestAccess: false,
        requireApproval: false,
        defaultRole: 'member',
        notifications: {
          taskAssigned: true,
          taskCompleted: true,
          checklistShared: true,
          memberJoined: true
        }
      },
      subscription: {
        plan: 'free',
        maxMembers: 5,
        features: ['basic-collaboration', 'task-assignment', 'comments']
      }
    }
    
    teams.value.push(newTeam)
    currentTeam.value = newTeam
    storedTeams.value = teams.value
    storedCurrentTeam.value = currentTeam.value
    
    logActivity('member_joined', undefined, `Created team "${name}"`)
    
    return newTeam
  }
  
  function inviteMember(email: string, role: 'admin' | 'member' | 'viewer' = 'member'): TeamInvite {
    if (!currentTeam.value) throw new Error('No team selected')
    if (!currentUser.value?.permissions.canInviteMembers) {
      throw new Error('You do not have permission to invite members')
    }
    
    const invite: TeamInvite = {
      id: generateId(),
      teamId: currentTeam.value.id,
      teamName: currentTeam.value.name,
      invitedBy: currentUser.value.id,
      invitedEmail: email,
      role,
      status: 'pending',
      token: generateId(), // In production, this would be a secure token
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
    
    teamInvites.value.push(invite)
    
    // Send invitation email (mock)
    console.log(`Invitation sent to ${email} for team ${currentTeam.value.name}`)
    
    logActivity('member_invited', undefined, `Invited ${email} to the team`)
    
    return invite
  }
  
  function acceptInvite(inviteId: string): TeamMember | null {
    const invite = teamInvites.value.find(i => i.id === inviteId)
    if (!invite || invite.status !== 'pending') return null
    
    const team = teams.value.find(t => t.id === invite.teamId)
    if (!team) return null
    
    const permissions: TeamPermissions = {
      canCreateChecklists: invite.role !== 'viewer',
      canEditChecklists: invite.role !== 'viewer',
      canDeleteChecklists: invite.role === 'admin',
      canCompleteTasks: true,
      canAssignTasks: invite.role !== 'viewer',
      canInviteMembers: invite.role === 'admin',
      canManageTeam: invite.role === 'admin',
      canViewReports: true
    }
    
    const newMember: TeamMember = {
      id: generateId(),
      email: invite.invitedEmail,
      name: invite.invitedEmail.split('@')[0], // Default name from email
      role: invite.role,
      status: 'active',
      joinedAt: new Date(),
      permissions
    }
    
    team.members.push(newMember)
    invite.status = 'accepted'
    invite.acceptedAt = new Date()
    
    logActivity('member_joined', undefined, `${newMember.name} joined the team`)
    
    return newMember
  }
  
  function assignTask(
    taskId: string,
    memberId: string,
    dueDate?: Date,
    priority?: 'low' | 'medium' | 'high' | 'urgent',
    notes?: string
  ): TaskAssignment {
    if (!currentUser.value?.permissions.canAssignTasks) {
      throw new Error('You do not have permission to assign tasks')
    }
    
    const member = teamMembers.value.find(m => m.id === memberId)
    if (!member) throw new Error('Member not found')
    
    const assignment: TaskAssignment = {
      taskId,
      assignedTo: memberId,
      assignedBy: currentUser.value!.id,
      assignedAt: new Date(),
      dueDate,
      priority: priority || 'medium',
      status: 'pending',
      notes
    }
    
    taskAssignments.value.push(assignment)
    
    // Create notification
    createNotification(
      memberId,
      'task_assigned',
      'New Task Assigned',
      `You have been assigned a new task${dueDate ? ` due ${dueDate.toLocaleDateString()}` : ''}`,
      { taskId, assignmentId: assignment.taskId }
    )
    
    logActivity('task_assigned', taskId, `Assigned task to ${member.name}`)
    
    return assignment
  }
  
  function completeAssignment(taskId: string) {
    const assignment = taskAssignments.value.find(a => a.taskId === taskId)
    if (!assignment) return
    
    assignment.status = 'completed'
    
    // Notify the person who assigned the task
    createNotification(
      assignment.assignedBy,
      'task_completed',
      'Task Completed',
      `A task you assigned has been completed`,
      { taskId }
    )
    
    logActivity('task_completed', taskId, 'Completed assigned task')
  }
  
  function shareChecklist(
    checklistId: string,
    memberIds: string[],
    permissions: Partial<SharedChecklist['permissions']> = {}
  ): SharedChecklist {
    if (!currentTeam.value) throw new Error('No team selected')
    if (!currentUser.value) throw new Error('No authenticated user')
    
    const sharedChecklist: SharedChecklist = {
      id: generateId(),
      checklistId,
      teamId: currentTeam.value.id,
      sharedBy: currentUser.value.id,
      sharedWith: memberIds,
      permissions: {
        canView: true,
        canEdit: permissions.canEdit ?? false,
        canDelete: permissions.canDelete ?? false,
        canComplete: permissions.canComplete ?? true,
        canAssign: permissions.canAssign ?? false,
        canComment: permissions.canComment ?? true
      },
      sharedAt: new Date()
    }
    
    sharedChecklists.value.push(sharedChecklist)
    
    // Notify team members
    memberIds.forEach(memberId => {
      createNotification(
        memberId,
        'checklist_shared',
        'Checklist Shared',
        'A checklist has been shared with you',
        { checklistId }
      )
    })
    
    logActivity('checklist_shared', checklistId, `Shared checklist with ${memberIds.length} members`)
    
    return sharedChecklist
  }
  
  function addComment(
    checklistId: string,
    content: string,
    taskId?: string,
    mentions?: string[]
  ): TeamComment {
    if (!currentUser.value) throw new Error('No authenticated user')
    
    const comment: TeamComment = {
      id: generateId(),
      checklistId,
      taskId,
      authorId: currentUser.value.id,
      authorName: currentUser.value.name,
      content,
      mentions,
      createdAt: new Date(),
      isEdited: false
    }
    
    teamComments.value.push(comment)
    
    // Notify mentioned users
    mentions?.forEach(memberId => {
      createNotification(
        memberId,
        'comment_mention',
        'You were mentioned',
        `${currentUser.value!.name} mentioned you in a comment`,
        { commentId: comment.id, checklistId }
      )
    })
    
    logActivity('comment_added', checklistId, 'Added a comment')
    
    return comment
  }
  
  function updateMemberRole(memberId: string, newRole: TeamMember['role']) {
    if (!currentUser.value?.permissions.canManageTeam) {
      throw new Error('You do not have permission to manage team members')
    }
    
    const member = teamMembers.value.find(m => m.id === memberId)
    if (!member) return
    
    const oldRole = member.role
    member.role = newRole
    
    // Update permissions based on new role
    member.permissions = {
      canCreateChecklists: newRole !== 'viewer',
      canEditChecklists: newRole !== 'viewer',
      canDeleteChecklists: newRole === 'admin' || newRole === 'owner',
      canCompleteTasks: true,
      canAssignTasks: newRole !== 'viewer',
      canInviteMembers: newRole === 'admin' || newRole === 'owner',
      canManageTeam: newRole === 'admin' || newRole === 'owner',
      canViewReports: true
    }
    
    createNotification(
      memberId,
      'role_changed',
      'Role Updated',
      `Your role has been changed from ${oldRole} to ${newRole}`,
      { oldRole, newRole }
    )
    
    logActivity('role_changed', undefined, `Changed ${member.name}'s role from ${oldRole} to ${newRole}`)
  }
  
  function createNotification(
    userId: string,
    type: CollaborationNotification['type'],
    title: string,
    message: string,
    data?: any
  ) {
    const notification: CollaborationNotification = {
      id: generateId(),
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date()
    }
    
    notifications.value.unshift(notification)
    storedNotifications.value = notifications.value
    
    return notification
  }
  
  function markNotificationRead(notificationId: string) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      storedNotifications.value = notifications.value
    }
  }
  
  function markAllNotificationsRead() {
    notifications.value.forEach(n => n.read = true)
    storedNotifications.value = notifications.value
  }
  
  function logActivity(
    action: TeamActivity['action'],
    target?: string,
    details?: string
  ) {
    if (!currentTeam.value || !currentUser.value) return
    
    const activity: TeamActivity = {
      id: generateId(),
      teamId: currentTeam.value.id,
      memberId: currentUser.value.id,
      memberName: currentUser.value.name,
      action,
      target,
      details,
      timestamp: new Date()
    }
    
    teamActivities.value.unshift(activity)
    
    // Keep only last 100 activities
    if (teamActivities.value.length > 100) {
      teamActivities.value = teamActivities.value.slice(0, 100)
    }
  }
  
  function switchTeam(teamId: string) {
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      currentTeam.value = team
      storedCurrentTeam.value = team
      
      // Load team-specific data
      loadTeamData(teamId)
    }
  }
  
  function loadTeamData(teamId: string) {
    // In production, this would fetch data from the server
    // For now, we'll just filter local data
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      teamMembers.value = team.members
      sharedChecklists.value = sharedChecklists.value.filter(c => c.teamId === teamId)
      teamActivities.value = teamActivities.value.filter(a => a.teamId === teamId)
    }
  }
  
  function leaveTeam(teamId: string) {
    if (!currentUser.value) return
    
    const team = teams.value.find(t => t.id === teamId)
    if (!team) return
    
    // Remove current user from team
    team.members = team.members.filter(m => m.id !== currentUser.value!.id)
    
    // If current team, switch to another or null
    if (currentTeam.value?.id === teamId) {
      currentTeam.value = teams.value.find(t => t.id !== teamId) || null
      storedCurrentTeam.value = currentTeam.value
    }
    
    // Remove team if no members left
    if (team.members.length === 0) {
      teams.value = teams.value.filter(t => t.id !== teamId)
    }
    
    storedTeams.value = teams.value
  }
  
  return {
    // State
    currentTeam,
    teams,
    teamMembers,
    sharedChecklists,
    taskAssignments,
    teamActivities,
    teamComments,
    teamInvites,
    notifications,
    currentUser,
    
    // Computed
    activeTeamMembers,
    pendingInvites,
    unreadNotifications,
    myAssignments,
    teamStats,
    
    // Actions
    createTeam,
    inviteMember,
    acceptInvite,
    assignTask,
    completeAssignment,
    shareChecklist,
    addComment,
    updateMemberRole,
    createNotification,
    markNotificationRead,
    markAllNotificationsRead,
    switchTeam,
    leaveTeam
  }
})