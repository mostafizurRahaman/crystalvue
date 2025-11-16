import { cn } from "@/lib/utils";
import "./globals.css";
import AppLayout from "@/components/layouts/AppLayout";
import { poppins } from "@/configs/font";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Crestal ",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(poppins.className, poppins.variable, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
