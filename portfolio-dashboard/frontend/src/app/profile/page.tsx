import { generateTimeline, getTestimonials, getSkillSignals } from './data';
import { ProfileTimeline } from './components/ProfileTimeline';
import { TestimonialsMatrix } from './components/TestimonialsMatrix';
import { SkillHeatmap } from './components/SkillHeatmap';
import { ProfileCtas } from './components/ProfileCtas';

export default function ProfileHubPage() {
  const timeline = generateTimeline();
  const testimonials = getTestimonials();
  const skills = getSkillSignals();

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Dynamic Profile Hub</p>
          <h1 className="mt-4 text-4xl font-semibold">Interactive proof of mastery</h1>
          <p className="mt-2 text-white/70">
            Timeline, testimonials, and skill signals adapt to persona-informed journeys.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <ProfileTimeline events={timeline} />
          <SkillHeatmap skills={skills} />
        </div>
        <TestimonialsMatrix testimonials={testimonials} />
        <ProfileCtas />
      </div>
    </div>
  );
}
