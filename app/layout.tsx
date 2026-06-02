import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://unscramblewordnow.com"),
  title: {
    default: "Unscramble Word Now",
    template: "%s | Unscramble Word Now",
  },
  description:
    "Unscramble letters, find words by length, starting letter, ending pattern, and word patterns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}