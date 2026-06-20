'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { useAuth } from '@/lib/auth-context'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill name, email, and password.')
      return
    }
    await signup(name.trim(), email.trim(), password)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#e6e0ff] text-[#2d2361]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-[#d3c8fa] bg-[#f3efff] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d5491]">Create Account</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">Start publishing with confidence</h1>
            <p className="mt-5 text-sm leading-8 text-[#5d5491]">
              Register to publish releases, organize updates by category, and manage your newsroom workflow.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d3c8fa] bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d5491]">Sign up</p>
            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <input
                className="h-12 rounded-xl border border-[#d3c8fa] bg-[#f8f5ff] px-4 text-sm text-[#2d2361]"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                className="h-12 rounded-xl border border-[#d3c8fa] bg-[#f8f5ff] px-4 text-sm text-[#2d2361]"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className="h-12 rounded-xl border border-[#d3c8fa] bg-[#f8f5ff] px-4 text-sm text-[#2d2361]"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#5b46b2] px-6 text-sm font-semibold text-white hover:bg-[#4b3993] disabled:opacity-70"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
            <div className="mt-6 flex items-center justify-end text-sm text-[#5d5491]">
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
