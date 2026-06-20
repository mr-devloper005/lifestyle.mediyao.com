import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowRight, Bookmark, Building2, FileText, Globe2, Image as ImageIcon, LayoutGrid, MapPin, ShieldCheck, Tag, TrendingUp, User } from 'lucide-react'

import { ContentImage } from '@/components/shared/content-image'

import { NavbarShell } from '@/components/shared/navbar-shell'

import { Footer } from '@/components/shared/footer'
import { FeaturedPostsSection } from '@/components/home/featured-posts-section'

import { SchemaJsonLd } from '@/components/seo/schema-jsonld'

import { TaskPostCard } from '@/components/shared/task-post-card'

import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

import { buildPageMetadata } from '@/lib/seo'

import { fetchTaskPosts } from '@/lib/task-data'

import { siteContent } from '@/config/site.content'

import { getFactoryState } from '@/design/factory/get-factory-state'

import { getProductKind, type ProductKind } from '@/design/factory/get-product-kind'

import type { SitePost } from '@/lib/site-connector'


import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'



export const revalidate = 300



export async function generateMetadata(): Promise<Metadata> {

  return buildPageMetadata({

    path: '/',

    title: siteContent.home.metadata.title,

    description: siteContent.home.metadata.description,

    openGraphTitle: siteContent.home.metadata.openGraphTitle,

    openGraphDescription: siteContent.home.metadata.openGraphDescription,

    image: SITE_CONFIG.defaultOgImage,

    keywords: [...siteContent.home.metadata.keywords],

  })

}



type EnabledTask = (typeof SITE_CONFIG.tasks)[number]

type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }



const taskIcons: Record<TaskKey, any> = {

  article: FileText,

  listing: Building2,

  classified: Tag,

  image: ImageIcon,

  profile: User,

  sbm: Bookmark,

  mediaDistribution: FileText,

  social: LayoutGrid,

  pdf: FileText,

  org: Building2,

  comment: FileText,

}



function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {

  if (

    value === 'listing' ||

    value === 'classified' ||

    value === 'article' ||

    value === 'image' ||

    value === 'profile' ||

    value === 'sbm' ||

    value === 'mediaDistribution'

  )

    return value

  return fallback

}



function getTaskHref(task: TaskKey, slug: string) {

  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`

  return `${route}/${slug}`

}



function getPostImage(post?: SitePost | null) {

  const media = Array.isArray(post?.media) ? post?.media : []

  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url

  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)

    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)

    : null

  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'

    ? (post.content as any).logo

    : null

  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'

}

function getPostImageOrNull(post?: SitePost | null) {
  if (!post) return null
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post.content === 'object' && post.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post.content === 'object' && post.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || null
}



function getPostMeta(post?: SitePost | null) {

  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }

  const content = post.content as Record<string, unknown>

  return {

    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',

    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',

  }

}



function getDirectoryTone(brandPack: string) {

  if (brandPack === 'market-utility') {

    return {

      shell: 'bg-[#FFFBF8] text-[#852747]',

      hero: 'bg-[linear-gradient(180deg,#FFFBF8_0%,#F5C6A5/20_100%)]',

      panel: 'border border-[#A2416B]/20 bg-white shadow-[0_24px_64px_rgba(162,65,107,0.08)]',

      soft: 'border border-[#A2416B]/15 bg-[#FFFBF8]',

      muted: 'text-[#852747]/80',

      title: 'text-[#852747]',

      badge: 'bg-[#A2416B] text-white',

      action: 'bg-[#A2416B] text-white hover:bg-[#852747]',

      actionAlt: 'border border-[#A2416B]/20 bg-white text-[#852747] hover:bg-[#F5C6A5]/30',

    }

  }

  return {

    shell: 'bg-[#FFFBF8] text-[#852747]',

    hero: 'bg-[linear-gradient(180deg,#FFFBF8_0%,#F5C6A5/15_100%)]',

    panel: 'border border-[#A2416B]/20 bg-white shadow-[0_24px_64px_rgba(162,65,107,0.08)]',

    soft: 'border border-[#A2416B]/15 bg-[#FFFBF8]',

    muted: 'text-[#852747]/80',

    title: 'text-[#852747]',

    badge: 'bg-[#A2416B] text-white',

    action: 'bg-[#A2416B] text-white hover:bg-[#852747]',

    actionAlt: 'border border-[#A2416B]/20 bg-white text-[#852747] hover:bg-[#F5C6A5]/30',

  }

}



function getEditorialTone() {

  return {

    shell: 'bg-[#FFFBF8] text-[#852747]',

    panel: 'border border-[#A2416B]/20 bg-white shadow-[0_24px_60px_rgba(162,65,107,0.08)]',

    soft: 'border border-[#A2416B]/15 bg-[#FFFBF8]',

    muted: 'text-[#852747]/80',

    title: 'text-[#852747]',

    badge: 'bg-[#A2416B] text-white',

    action: 'bg-[#A2416B] text-white hover:bg-[#852747]',

    actionAlt: 'border border-[#A2416B]/20 bg-transparent text-[#852747] hover:bg-[#F5C6A5]/30',

  }

}



function getVisualTone() {

  return {

    shell: 'bg-[#07101f] text-white',

    panel: 'border border-white/10 bg-[rgba(11,18,31,0.78)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]',

    soft: 'border border-white/10 bg-white/6',

    muted: 'text-slate-300',

    title: 'text-white',

    badge: 'bg-[#8df0c8] text-[#07111f]',

    action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',

    actionAlt: 'border border-white/10 bg-white/6 text-white hover:bg-white/10',

  }

}



function getCurationTone() {

  return {

    shell: 'bg-[#FFFBF8] text-[#852747]',

    panel: 'border border-[#A2416B]/20 bg-white shadow-[0_24px_60px_rgba(162,65,107,0.08)]',

    soft: 'border border-[#A2416B]/15 bg-[#FFFBF8]',

    muted: 'text-[#852747]/80',

    title: 'text-[#852747]',

    badge: 'bg-[#A2416B] text-white',

    action: 'bg-[#A2416B] text-white hover:bg-[#852747]',

    actionAlt: 'border border-[#A2416B]/20 bg-transparent text-[#852747] hover:bg-[#F5C6A5]/30',

  }

}



function DirectoryHome({
  primaryTask,
  enabledTasks,
  listingPosts,
  classifiedPosts,
  profilePosts,
  brandPack,
}: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 3)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const quickRoutes = enabledTasks.slice(0, 4)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title} mb-6`}>
            {SITE_CONFIG.name}
          </h1>
          <p className={`text-xl leading-8 ${tone.muted} max-w-3xl mx-auto`}>
            {SITE_CONFIG.description}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((post) => (
            <div key={post.id} className={tone.panel}>
              <TaskPostCard
                post={post}
                href={getTaskHref(featuredTaskKey, post.slug)}
                taskKey={featuredTaskKey}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function VisualHome({
  primaryTask,
  imagePosts,
  profilePosts,
  articlePosts,
}: {
  primaryTask?: EnabledTask
  imagePosts: SitePost[]
  profilePosts: SitePost[]
  articlePosts: SitePost[]
}) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 5) : articlePosts.slice(0, 5)
  const creators = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <ImageIcon className="h-3.5 w-3.5" />
              Visual publishing system
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Image-led discovery with creator profiles and a more gallery-like browsing rhythm.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/images'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Meet creators
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={getTaskHref(resolveTaskKey((post as { task?: unknown }).task, 'image'), post.slug)}
                className={index === 0 ? `col-span-2 row-span-2 overflow-hidden rounded-[2.4rem] ${tone.panel}` : `overflow-hidden rounded-[1.8rem] ${tone.soft}`}
              >
                <div className={index === 0 ? 'relative h-[360px]' : 'relative h-[170px]'}>
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Visual notes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Larger media surfaces, fewer boxes, stronger pacing.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>This product avoids business-directory density and publication framing. The homepage behaves more like a visual board, with profile surfaces and imagery leading the experience.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {creators.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Creator profile and visual identity surface.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CurationHome({
  primaryTask,
  bookmarkPosts,
  profilePosts,
  articlePosts,
}: {
  primaryTask?: EnabledTask
  bookmarkPosts: SitePost[]
  profilePosts: SitePost[]
  articlePosts: SitePost[]
}) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey((post as { task?: unknown }).task, 'sbm'), post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-32 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function EditorialHome({
  primaryTask,
  posts,
  supportTasks,
}: {
  primaryTask?: EnabledTask
  posts: SitePost[]
  supportTasks: EnabledTask[]
}) {
  const defaultEditorialTask: TaskKey =
    primaryTask?.key === 'mediaDistribution' || primaryTask?.key === 'article'
      ? primaryTask.key
      : 'article'

  const postHref = (post: SitePost) =>
    getTaskHref(resolveTaskKey((post as { task?: unknown }).task, defaultEditorialTask), post.slug)

  const featuredPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    summary: post.summary,
    href: postHref(post),
    publishedAt: post.publishedAt,
    image: getPostImageOrNull(post),
  }))

  return (
    <main className="bg-[#f3f3f5] text-[#1f2330]">
      <section className="relative overflow-hidden bg-[#11151d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(162,65,107,0.28),transparent_40%),radial-gradient(circle_at_85%_12%,rgba(245,198,165,0.2),transparent_33%)]" />
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("/press-release-hero.jpg")' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e121a]/90 via-[#0f1420]/78 to-[#0f1420]/66" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
          <div className="mw-fade-up">
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Press Release
              <span className="block text-[#f5c6a5]">Distribution Network</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">
              Publish with confidence to premium media surfaces and amplify your brand across trusted editorial channels.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/updates"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ffc730] px-8 py-4 text-base font-semibold text-[#1a1f2a] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#ffd550]"
              >
                Browse Press Release
              </Link>
            </div>
          </div>
          <div className="mw-fade-up-delayed rounded-[2rem] border border-white/16 bg-white/10 p-7 shadow-[0_35px_90px_rgba(0,0,0,0.42)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">Performance Highlights</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/14 bg-black/15 p-5">
                <p className="text-4xl font-semibold text-white">150+</p>
                <p className="mt-1 text-sm text-slate-200">Syndication outlets</p>
              </div>
              <div className="rounded-2xl border border-white/14 bg-black/15 p-5">
                <p className="text-4xl font-semibold text-white">24h</p>
                <p className="mt-1 text-sm text-slate-200">Average publication cycle</p>
              </div>
              <div className="rounded-2xl border border-white/14 bg-black/15 p-5">
                <p className="text-4xl font-semibold text-white">98%</p>
                <p className="mt-1 text-sm text-slate-200">Client satisfaction score</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#6b7280]">Online Press Release Distribution</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#1f2330] sm:text-5xl">Press Release Distribution Service</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Traditional Newsroom',
              text: 'A clean media newsroom where news, events, and company updates live in one consistent publishing flow.',
            },
            {
              title: 'PR Distribution',
              text: 'Publish to 150+ media platforms and put your story in front of journalists, editors, and search audiences.',
            },
            {
              title: 'Press Release Packages',
              text: 'Get placement, promotion, and actionable dashboard analytics with package-based distribution options.',
            },
          ].map((service) => (
            <div key={service.title} className="mw-fade-up rounded-3xl border border-[#d6d9e0] bg-white p-8 shadow-[0_22px_45px_rgba(16,24,40,0.08)]">
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1f2330]">{service.title}</h3>
              <p className="mt-4 text-[15px] leading-8 text-[#4b5568]">{service.text}</p>
              <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#852747] hover:text-[#a2416b]">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#e4e4e7] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <h3 className="text-4xl font-semibold tracking-[-0.03em] text-[#1f2330]">Press Release Distribution Sites</h3>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-[#6b7280]">The place where your press release gets distributed</p>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { name: 'Google News', image: '/engine-google-news.svg' },
                { name: 'Bing', image: '/engine-bing.svg' },
                { name: 'Flipboard', image: '/engine-flipboard.svg' },
                { name: 'Buzz Reporter', image: '/engine-buzz-reporter.svg' },
                { name: 'World Insiders', image: '/engine-world-insiders.svg' },
                { name: 'NewsNet', image: '/engine-newsnet.svg' },
              ].map((engine) => (
                <div key={engine.name} className="group rounded-2xl border border-white/80 bg-white/80 p-3 text-center shadow-[0_12px_24px_rgba(17,24,39,0.08)] transition-transform hover:-translate-y-1">
                  <div className="overflow-hidden rounded-xl border border-[#d7dae2] bg-white">
                    <div className="relative h-20">
                      <ContentImage src={engine.image} alt={engine.name} fill className="object-contain p-1" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#2f3545]">{engine.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#d7dae2] bg-white p-8 shadow-[0_30px_70px_rgba(19,28,46,0.08)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-8 border-[#0f4ea8] bg-[#0757be] text-center text-white shadow-[0_20px_50px_rgba(15,78,168,0.32)]">
              <div>
                <p className="text-4xl font-semibold">100%</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Satisfaction</p>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-semibold tracking-[-0.03em] text-[#1f2330]">Guaranteed News Distribution with Media Coverage</h3>
              <p className="mt-5 text-lg leading-8 text-[#4b5568]">
                Your press release appears in premium publications and trusted aggregators, with guaranteed media partner delivery.
              </p>
              <p className="mt-3 text-lg leading-8 text-[#4b5568]">
                Get syndicated visibility across Google News, Bing News, and partner websites for strong search and media discoverability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-1">
          <div className="rounded-[2rem] border border-[#d7dae2] bg-white p-8 shadow-[0_22px_55px_rgba(16,24,40,0.07)]">
            <h3 className="text-4xl font-semibold tracking-[-0.03em] text-[#1f2330]">Getting Published on Our Sites</h3>
            <ul className="mt-7 space-y-4 text-lg leading-8 text-[#41495b]">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#0f7f4a]" />
                Syndication into a broad online media network with strong PR visibility.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#0f7f4a]" />
                Distribution to newsroom, news engines, and long-term indexed placements.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#0f7f4a]" />
                Ongoing analytics to monitor reach, placements, and discovery performance.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <FeaturedPostsSection posts={featuredPosts} />
    </main>
  )
}


export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {

    return <HomePageOverride />

  }



  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)

  const { recipe } = getFactoryState()

  const productKind = getProductKind(recipe)

  const taskFeed: TaskFeedItem[] = (

    await Promise.all(

      enabledTasks.map(async (task) => ({

        task,

        posts: await fetchTaskPosts(task.key, 6, { allowMockFallback: false, fresh: false, revalidate: 120 }),

      }))

    )

  ).filter(({ posts }) => posts.length)



  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]

  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)

  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []

  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []

  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []

  const mediaDistributionPosts =

    taskFeed.find(({ task }) => task.key === 'mediaDistribution')?.posts || []

  const editorialRaw = articlePosts.length ? articlePosts : mediaDistributionPosts

  const editorialPosts = editorialRaw.slice(0, 16)

  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []

  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []

  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []



  const schemaData = [

    {

      '@context': 'https://schema.org',

      '@type': 'Organization',

      name: SITE_CONFIG.name,

      url: SITE_CONFIG.baseUrl,

      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,

      sameAs: [],

    },

    {

      '@context': 'https://schema.org',

      '@type': 'WebSite',

      name: SITE_CONFIG.name,

      url: SITE_CONFIG.baseUrl,

      potentialAction: {

        '@type': 'SearchAction',

        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,

        'query-input': 'required name=search_term_string',

      },

    },

  ]



  return (

    <div className="min-h-screen bg-background text-foreground">

      <NavbarShell />

      <SchemaJsonLd data={schemaData} />

      {productKind === 'directory' ? (

        <DirectoryHome

          primaryTask={primaryTask}

          enabledTasks={enabledTasks}

          listingPosts={listingPosts}

          classifiedPosts={classifiedPosts}

          profilePosts={profilePosts}

          brandPack={recipe.brandPack}

        />

      ) : null}

      {productKind === 'editorial' ? (

        <EditorialHome primaryTask={primaryTask} posts={editorialPosts} supportTasks={supportTasks} />

      ) : null}

      {productKind === 'visual' ? (

        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />

      ) : null}

      {productKind === 'curation' ? (

        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />

      ) : null}

      <Footer />

    </div>

  )

}

