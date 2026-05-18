import { TaskListPage } from '@/components/tasks/task-list-page'
import { buildTaskMetadata } from '@/lib/seo'

export const revalidate = 3
export const generateMetadata = () => buildTaskMetadata('mediaDistribution')

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string }>
}) {
  const resolved = (await searchParams) || {}
  return <TaskListPage task="mediaDistribution" category={resolved.category} query={resolved.q} />
}
