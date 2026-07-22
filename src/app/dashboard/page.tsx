'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Ticket, TicketStatus } from '@/types'
import { TicketIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTickets = async () => {
      const { data } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })
      setTickets(data || [])
      setLoading(false)
    }
    fetchTickets()
  }, [])

  const stats = [
    { label: 'Total Tickets', value: tickets.length, icon: TicketIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Open', value: tickets.filter(t => t.status === 'open').length, icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'in_progress').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your support tickets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`bg-gray-900 border rounded-xl p-5 flex items-center gap-4 ${bg}`}>
            <div className={`p-2.5 rounded-lg bg-gray-800`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Recent Tickets</h2>
          <Link href="/tickets" className="text-xs text-indigo-400 hover:text-indigo-300">View all</Link>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-center text-gray-500 text-sm">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500 text-sm">No tickets yet. <Link href="/tickets/new" className="text-indigo-400 hover:underline">Create one</Link></div>
        ) : (
          <div className="divide-y divide-gray-800">
            {tickets.slice(0, 5).map(ticket => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition">
                <div>
                  <p className="text-sm font-medium text-white">{ticket.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ticket.category} · {new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge type="priority" value={ticket.priority} />
                  <Badge type="status" value={ticket.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}