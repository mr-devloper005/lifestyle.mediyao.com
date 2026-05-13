export const siteTaskDefinitions = [
  {
    key: 'mediaDistribution',
    label: 'Updates',
    route: '/media',
    description: 'Recent posts and newsroom updates.',
    contentType: 'mediaDistribution',
    enabled: true,
  },
] as const

export const siteTaskViews = {
  mediaDistribution: '/media',
} as const
