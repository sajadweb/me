import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Services } from '@/components/services';
import { Process } from '@/components/process';
import { PortfolioPreview } from '@/components/portfolio-preview';
import { CtaBand } from '@/components/cta-band';

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Process />
      <PortfolioPreview locale={locale} />
      <CtaBand />
    </>
  );
}
