'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import { cn } from '@/lib/utils'

export const NAVBAR_OVERRIDE_ENABLED = true

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Latest News', href: '/updates' },
  // { label: 'Pricing', href: '/pricing' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function NavbarOverride() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo + name + tagline */}
        <Link href="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src="/favicon.png?v=20260518" alt={`${SITE_CONFIG.name} logo`} width="32" height="32" className="h-8 w-8 object-contain" />
          </div>
          <div className="hidden sm:block">
            <span className="block text-[15px] font-bold leading-tight text-gray-900">
              {SITE_CONFIG.name}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.22em] text-gray-400">
              {siteContent.navbar.tagline}
            </span>
          </div>
          <span className="block text-[15px] font-bold leading-tight text-gray-900 sm:hidden">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right: search + auth + CTA */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden rounded-full text-gray-500 hover:text-gray-900 md:flex"
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            {!isAuthenticated ? (
              <Button
                size="sm"
                asChild
                className="rounded-full bg-[#5b46b2] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4b3993]"
              >
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full bg-[#5b46b2] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4b3993]"
                >
                  <Link href="/create/mediaDistribution">Create Post</Link>
                </Button>
                <Button
                  size="sm"
                  onClick={logout}
                  className="rounded-full bg-[#2f2f38] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#1f1f26]"
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-600 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="mb-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500"
            >
              <Search className="h-4 w-4" />
              Search the site
            </Link>
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2">
              {!isAuthenticated ? (
                <Button size="sm" asChild className="w-full rounded-full bg-[#5b46b2] text-white hover:bg-[#4b3993]">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" asChild className="w-full rounded-full bg-[#5b46b2] text-white hover:bg-[#4b3993]">
                    <Link href="/create/mediaDistribution" onClick={() => setMobileOpen(false)}>
                      Create Post
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full rounded-full bg-[#2f2f38] text-white hover:bg-[#1f1f26]"
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
