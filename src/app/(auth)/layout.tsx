import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FarmLink - Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 text-center text-primary-foreground p-12">
          <div className="text-6xl mb-6">🌾</div>
          <h1 className="text-4xl font-bold mb-4">FarmLink</h1>
          <p className="text-xl opacity-90">Connecting Farms to Families</p>
          <p className="mt-4 opacity-75">Smart India Hackathon 2026</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
