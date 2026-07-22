export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type UserRole = 'user' | 'agent' | 'admin'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Comment {
  id: string
  ticket_id: string
  author_id: string
  content: string
  created_at: string
  profiles?: Profile
}