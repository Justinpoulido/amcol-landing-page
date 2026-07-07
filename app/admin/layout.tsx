import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Protected AMCOL Industrial catalog administration workspace.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
