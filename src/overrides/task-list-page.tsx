import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { fetchTaskPosts } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'

export const TASK_LIST_PAGE_OVERRIDE_ENABLED = true

function excerpt(text?: string | null) {
  const value = (text || '').trim()
  if (!value) return 'Read the full post for the complete update.'
  return value.length > 220 ? value.slice(0, 217).trimEnd() + '...' : value
}

export async function TaskListPageOverride({ category, query }: { task: TaskKey; category?: string; query?: string }) {
  const posts = await fetchTaskPosts('mediaDistribution', 24, { fresh: true })
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const q = (query || '').trim().toLowerCase()

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
    const rawCategory = typeof content.category === 'string' ? content.category : 'update'
    const matchesCategory = normalizedCategory === 'all' || normalizeCategory(rawCategory) === normalizedCategory
    if (!matchesCategory) return false
    if (!q) return true
    const haystack = [post.title, post.summary, post.slug, rawCategory].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(q)
  })

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-neutral-900">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#1e293b] bg-[linear-gradient(130deg,#0b1220_0%,#17253b_55%,#273a59_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f5c6a5]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-[#60a5fa]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Media Wire</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Latest Updates</h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-200">
                Category-first filtering with keyword search in one clean feed.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-2xl font-semibold">{posts.length}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">Total</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-2xl font-semibold">{CATEGORY_OPTIONS.length}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">Categories</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-2xl font-semibold">{filtered.length}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">Results</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-[#d7dae2] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-6">
          <form action="/updates" className="grid gap-3 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <div>
              <label htmlFor="updates-q" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search</label>
              <input
                id="updates-q"
                name="q"
                defaultValue={query || ''}
                placeholder="Search title, summary, or category"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none"
              />
            </div>
            <div>
              <label htmlFor="updates-category" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</label>
              <select
                id="updates-category"
                name="category"
                defaultValue={normalizedCategory}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none"
              >
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="h-11 rounded-xl bg-[#0f172a] px-5 text-sm font-medium text-white hover:bg-[#1e293b]">Apply</button>
          </form>
        </section>

        <div className="mt-8 space-y-6">
          {filtered.map((post) => (
            <article key={post.id} className="rounded-[1.3rem] border border-[#d7dae2] bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{String((post.content as any)?.category || 'Update')}</p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[0.02em] sm:text-4xl">{post.title}</h2>
              <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
                <span>by {post.authorName || 'Editorial Desk'}</span>
              </div>
              <p className="mt-6 text-lg leading-9 text-neutral-700">{excerpt(post.summary)}</p>
              <div className="mt-7">
                <Link href={`/updates/${post.slug}`} className="inline-flex rounded-full bg-neutral-800 px-8 py-3 text-sm font-medium text-white hover:bg-black">Continue Reading</Link>
              </div>
            </article>
          ))}
          {!filtered.length ? (
            <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              No updates found for this filter.
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
