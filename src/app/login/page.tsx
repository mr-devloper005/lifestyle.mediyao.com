'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { useAuth } from '@/lib/auth-context'
import { LOGIN_PAGE_OVERRIDE_ENABLED, LoginPageOverride } from '@/overrides/login-page'

export default function LoginPage() {
  if (LOGIN_PAGE_OVERRIDE_ENABLED) {
    return <LoginPageOverride />
  }

  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.')
      return
    }
    await login(email.trim(), password)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#e6e0ff] text-[#2d2361]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-[#d3c8fa] bg-[#f3efff] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d5491]">Welcome Back</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">Login to your press room</h1>
            <p className="mt-5 text-sm leading-8 text-[#5d5491]">
              Access your account to manage releases, update content, and publish new announcements.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d3c8fa] bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d5491]">Sign in</p>
            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
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
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className="mt-6 flex items-center justify-end text-sm text-[#5d5491]">
              <Link href="/register" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
