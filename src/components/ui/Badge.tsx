import clsx from 'clsx'
import { TicketStatus, TicketPriority } from '@/types'

interface BadgeProps {
  type: 'status' | 'priority'
  value: TicketStatus | TicketPriority
}

const statusStyles: Record<TicketStatus, string> = {
  open: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  resolved: 'bg-green-500/10 text-green-400 border border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
}

const priorityStyles: Record<TicketPriority, string> = {
  low: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  medium: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  high: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

export default function Badge({ type, value }: BadgeProps) {
  const style =
    type === 'status'
      ? statusStyles[value as TicketStatus]
      : priorityStyles[value as TicketPriority]

  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', style)}>
      {value.replace('_', ' ')}
    </span>
  )
}