import { Noto_Sans_Arabic } from 'next/font/google';

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'نظام الوقاية من الصعق الكهربائي القائم على استشعار الإنسان | جامعة السودان',
  description:
    'نموذج أولي مختبري مُتحقق منه يكتشف اقتراب الإنسان أو ملامسته لموصل مكهرب ويعزل الدائرة قبل تدفق التيار الضار. طُوِّر في جامعة السودان للعلوم والتكنولوجيا – كلية الهندسة.',
  keywords: [
    'الوقاية من الصعق الكهربائي',
    'الاستشعار السعوي',
    'كشف اقتراب الإنسان',
    'مرحل حالة صلبة',
    'ATmega328P',
    'جامعة السودان للعلوم والتكنولوجيا',
    'الهندسة الإلكترونية',
    'مشروع تخرج',
  ],
  authors: [{ name: 'محمد طارق' }],
  creator: 'محمد طارق',
  publisher: 'جامعة السودان للعلوم والتكنولوجيا',
  openGraph: {
    title: 'نظام الوقاية من الصعق الكهربائي القائم على استشعار الإنسان',
    description:
      'نظام مختبري مُتحقق منه يستشعر اقتراب أو تلامس الإنسان ويعزل التيار قبل حدوث الصعق. زمن الاستجابة 5–21 مللي ثانية.',
    url: 'https://www.motarig.com/academic/ar',
    siteName: 'MT Solutions – المشاريع الأكاديمية',
    images: [
      {
        url: '/images/circuit_design.jpg',
        width: 1400,
        height: 1080,
        alt: 'التصميم النهائي لدائرة نظام الوقاية من الصعق الكهربائي القائم على استشعار الإنسان',
      },
    ],
    locale: 'ar_SD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نظام الوقاية من الصعق الكهربائي القائم على استشعار الإنسان',
    description:
      'استشعار سعوي للإنسان + عزل سريع بمرحل حالة صلبة. نموذج أولي مُتحقق منه من قسم الهندسة الإلكترونية بجامعة السودان.',
    images: ['/images/circuit_design.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.motarig.com/academic/ar',
    languages: {
      'ar': 'https://www.motarig.com/academic/ar',
      'en': 'https://www.motarig.com/academic/en',
    },
  },
};

export default function AcademicArLayout({ children }) {
  return (
    <div className={notoSansArabic.className} lang="ar" dir="rtl">
      {children}
    </div>
  );
}