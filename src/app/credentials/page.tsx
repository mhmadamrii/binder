"use client";

import Link from "next/link";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Credential() {
  const [cred, setCred] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      email: cred.email,
      password: cred.password,
      redirectTo: "/",
    });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-purple-700 text-white">
      <Link href="/">Go to Home</Link>
      <h1>Credentials Page</h1>
      <form
        onSubmit={handleSubmit}
        className="flex max-w-4xl flex-col gap-3 bg-purple-300"
      >
        <input
          placeholder="Email"
          value={cred.email}
          onChange={(e) => setCred({ ...cred, email: e.target.value })}
        />
        <input
          placeholder="Password"
          value={cred.password}
          onChange={(e) => setCred({ ...cred, password: e.target.value })}
        />
        <Button>Submit</Button>
      </form>
    </div>
  );
}
