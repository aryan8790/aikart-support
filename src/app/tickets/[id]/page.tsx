'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Ticket, Comment, TicketStatus } from '@/types'
import Badge from '@/components/ui/Badge'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'

export default function TicketDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data: t } = await supabase.from('tickets').select('*').eq('id', id).single()
      const { data: c } = await supabase.from('comments').select('*').eq('ticket_id', id).order('created_at')
      setTicket(t)
      setComments(c || [])
      setLoading(false)
    }
    fetch()
  }, [id])

  const updateStatus = async (status: TicketStatus) => {
    await supabase.from('tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setTicket(prev => prev ? { ...prev, status } : prev)
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('comments').insert({
      ticket_id: id, author_id: user?.id, content: newComment
    }).select().single()
    if (data) setComments(prev => [...prev, data])
    setNewComment('')
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>
  if (!ticket) return <div className="text-gray-400 text-sm">Ticket not found.</div>

  const statuses: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed']

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">{ticket.title}</h1>
          <Badge type="status" value={ticket.status} />
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{ticket.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Category: <span className="text-gray-300 capitalize">{ticket.category}</span></span>
          <span>Priority: <Badge type="priority" value={ticket.priority} /></span>
          <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>

        <div className="pt-2 border-t border-gray-800">
          <p className="text-xs font-medium text-gray-400 mb-2">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => updateStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${ticket.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-white">Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="bg-gray-800 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-200">{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(c.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment()}
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
          />
          <button onClick={addComment} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg transition">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}