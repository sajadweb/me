import { NeuralBackground } from '@/components/neural-background';

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-10">
      <NeuralBackground className="opacity-40" />
      <div className="glass relative z-10 rounded-3xl p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-white/60">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
