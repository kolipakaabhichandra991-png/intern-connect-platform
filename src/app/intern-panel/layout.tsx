import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intern Portal',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
