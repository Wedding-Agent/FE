export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #fdf4ff 50%, #f0f4ff 100%)' }}>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
