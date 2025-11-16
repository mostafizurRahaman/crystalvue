import Navigation from "@/components/navbar";
import AuthGuard from "@/components/wrappers/auth-guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthGuard>
        <Navigation />
        {children}
      </AuthGuard>
    </div>
  );
}
