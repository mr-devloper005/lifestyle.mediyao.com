'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'

type FeaturedPostItem = {
  id: string
  title: string
  summary?: string | null
  href: string
  publishedAt?: string
  image?: string | null
}

export function FeaturedPostsSection({ posts }: { posts: FeaturedPostItem[] }) {
  if (!posts.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#6b7280]">Latest Updates</p>
        <h3 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1f2330]">Featured Posts</h3>
      </div>

      <div className="mt-10 max-h-[70vh] overflow-y-auto rounded-2xl border border-[#d7dae2] bg-white p-4 shadow-[0_12px_30px_rgba(17,24,39,0.08)] sm:p-5">
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-[#d7dae2] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              {post.image ? (
                <div className="overflow-hidden rounded-xl border border-[#d7dae2] bg-[#eceef3] md:w-56 md:shrink-0">
                  <div className="relative h-40 md:h-28">
                    <ContentImage src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <h4 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#1f2330] md:text-xl">{post.title}</h4>
                <p className="mt-2 text-[15px] leading-7 text-[#4b5568] md:line-clamp-1">
                  {post.summary || 'Read this release for the full announcement and details.'}
                </p>
              </div>
              <Link href={post.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#852747] hover:text-[#a2416b] md:shrink-0">
                  Read full post
                  <ArrowRight className="h-4 w-4" />
              </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
