import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { onboardingSteps } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export const OnboardingModal = () => {
  const { isOnboardingComplete, completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(!isOnboardingComplete);

  const handleNext = () => {
    if (currentStep >= onboardingSteps.length - 1) {
      completeOnboarding();
      setIsOpen(false);
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, onboardingSteps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    completeOnboarding();
    setIsOpen(false);
  };

  const safeIndex = Math.min(currentStep, onboardingSteps.length - 1);
  const step = onboardingSteps[safeIndex];
  const StepIcon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        hideClose
        className="w-[calc(100%-2rem)] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <DialogClose asChild>
          <button
            onClick={handleSkip}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        </DialogClose>

        <div className="flex flex-col items-center text-center py-4 sm:py-6">
          <div className="mb-6 animate-float" aria-hidden="true">
            <StepIcon className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
          </div>
          
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-display text-xl sm:text-2xl">
              {step.title}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          {/* Progress dots */}
          <div className="flex flex-wrap justify-center gap-2 my-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-primary'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-row gap-3 w-full">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="shrink-0 basis-2/5"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
            )}
            <Button variant="hero" onClick={handleNext} className="flex-1">
              {currentStep === onboardingSteps.length - 1 ? (
                '¡Comenzar!'
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {currentStep === 0 && (
            <button
              onClick={handleSkip}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Saltar tutorial
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};