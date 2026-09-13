import { serviceIds } from '@utils/serviceMeta';

const baseUrl = 'https://www.motarig.com';

// Bump this manually whenever you make meaningful content changes
const lastModified = new Date('2026-09-13');

export default function sitemap() {
  const homeRoutes = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/?lang=ar`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const serviceRoutes = serviceIds.flatMap((id) => [
    {
      url: `${baseUrl}/services/${id}?lang=en`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/${id}?lang=ar`,

      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]);

  return [...homeRoutes, ...serviceRoutes];
}