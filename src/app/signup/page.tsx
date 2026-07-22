'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName, email, role: 'user' })
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">SupportDesk</h1>
          <p className="text-gray-400 text-sm mt-1">Create your account to get started</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <input type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <button onClick={handleSignup} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500">Already have an account?{' '}<Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}