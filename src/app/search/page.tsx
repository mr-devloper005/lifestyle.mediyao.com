import Link from "next/link";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { CATEGORY_OPTIONS } from "@/lib/categories";

export const revalidate = 3;

const matchText = (value: string, query: string) =>
  value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const normalizedCategory = category === "all" ? "" : category;
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined
  );
  const posts = feed?.posts?.length ? feed.posts : [];

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === "object" ? post.content : {};
    const typeText = compactText((content as any).type);
    if (typeText === "comment") return false;
    const description = compactText((content as any).description);
    const body = compactText((content as any).body);
    const excerpt = compactText((content as any).excerpt);
    const categoryText = compactText((content as any).category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    if (normalizedCategory && !derivedCategory.includes(normalizedCategory)) return false;
    if (task && typeText && typeText !== task) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-neutral-900">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#1e293b] bg-[linear-gradient(130deg,#0b1220_0%,#17253b_55%,#273a59_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f5c6a5]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-[#60a5fa]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Search Engine</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Explore All Content</h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-200">
                Same updates-style interface with global search across every task.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-2xl font-semibold">{posts.length}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">Indexed</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-2xl font-semibold">{CATEGORY_OPTIONS.length}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">Categories</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-2xl font-semibold">{results.length}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">Results</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-[#d7dae2] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-6">
          <form action="/search" className="grid gap-3 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <input type="hidden" name="master" value="1" />
            {task ? <input type="hidden" name="task" value={task} /> : null}
            <div>
              <label htmlFor="search-q" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search</label>
              <input
                id="search-q"
                name="q"
                defaultValue={query}
                placeholder="Search title, summary, tags..."
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none"
              />
            </div>
            <div>
              <label htmlFor="search-category" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</label>
              <select
                id="search-category"
                name="category"
                defaultValue={category || "all"}
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
          {results.length ? results.map((post) => {
            const taskKey = getPostTaskKey(post);
            const href = taskKey ? buildPostUrl(taskKey, post.slug) : `/posts/${post.slug}`;
            const postCategory = typeof (post.content as any)?.category === "string" ? (post.content as any).category : "Update";
            return (
              <article key={post.id} className="rounded-[1.3rem] border border-[#d7dae2] bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{postCategory}</p>
                <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[0.02em] sm:text-4xl">{post.title}</h2>
                <p className="mt-6 text-lg leading-9 text-neutral-700">{post.summary || "Open the full post for complete details."}</p>
                <div className="mt-7">
                  <Link href={href} className="inline-flex rounded-full bg-neutral-800 px-8 py-3 text-sm font-medium text-white hover:bg-black">Continue Reading</Link>
                </div>
              </article>
            );
          }) : (
            <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              No matching posts yet.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
