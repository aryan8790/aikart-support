'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) setFullName(data.full_name || '')
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user?.id)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = "w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account preferences</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-white border-b border-gray-800 pb-3">Profile Information</h2>
        {saved && <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm">Changes saved successfully.</div>}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder="Your full name" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Email Address</label>
          <input type="email" value={email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
          <p className="text-xs text-gray-500">Email cannot be changed.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}