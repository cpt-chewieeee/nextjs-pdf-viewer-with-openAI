import { useSession } from "next-auth/react";
import Link from "next/link";


export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  console.log('header', session, status);
  return (
    <header>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <ul>
          <li>
            <Link href='/dashboard'>Test</Link>
          </li>
          <li>
            <Link href='/dashboard'>Home</Link>
          </li>
          <li>
            <Link href='/dashboard'>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}