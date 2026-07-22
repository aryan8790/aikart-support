'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewTicketPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!title || !description) { setError('Title and description are required.'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('tickets').insert({
      title, description, priority, category, created_by: user?.id, status: 'open'
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/tickets')
  }

  const inputClass = "w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5"

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create Ticket</h1>
        <p className="text-gray-400 text-sm mt-1">Submit a new support request</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

        <div>
          <label className={labelClass}>Title</label>
          <input type="text" placeholder="Brief summary of the issue" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={5} className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
              <option value="general">General</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className={inputClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition">
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
          <button onClick={() => router.back()} className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-6 py-2.5 rounded-lg text-sm transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}