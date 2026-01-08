import { Layout } from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import { CTASection } from '@/components/home/CTASection';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

const Index = () => {
  return (
    <Layout>
      <OnboardingModal />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorks />
      <CTASection />
    </Layout>
  );
};

export default Index;
