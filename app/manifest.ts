import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flow Productivity',
    short_name: 'Flow',
    description: 'Intelligent Happiness — Human-Centered Platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBF5',
    theme_color: '#FDB913',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
  }
}
