'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div>
        {session ? (
          <button onClick={() => signOut()} className="underline">
            Sign out
          </button>
        ) : (
          <button onClick={() => signIn()} className="underline">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
