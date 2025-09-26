import { AnimationLibrary } from './components/AnimationLibrary';
import { NarrativeSequencer } from './components/NarrativeSequencer';

export default function AnimationSuitePage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Animation Suite</p>
          <h1 className="mt-4 text-4xl font-semibold">Curated motion system for dashboard storytelling</h1>
          <p className="mt-2 text-white/70">
            Preview GSAP, Framer Motion, and Lottie-powered interactions.
          </p>
        </header>
        <AnimationLibrary />
        <NarrativeSequencer />
      </div>
    </div>
  );
}
