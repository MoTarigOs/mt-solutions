import { serviceMeta } from '@utils/serviceMeta.js';

const baseUrl = 'https://www.motarig.com';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const entry = serviceMeta[id] || serviceMeta['web-dev'];
  const { title: titleEn, desc: descEn } = entry.en;

  const title = `${titleEn} | MT SOLUTIONS - Mohamed Tarig`;
  const description = descEn;
  const url = `${baseUrl}/services/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${url}?lang=en`,
        ar: `${url}?lang=ar`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'MT SOLUTIONS',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default function ServiceDetailLayout({ children }) {
  return children;
}