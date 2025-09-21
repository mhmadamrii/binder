import Link from "next/link";

import { Suspense } from "react";
import { api } from "~/trpc/server";

async function ShitWithData() {
  const posts = await api.post.getAllPosts();
  return (
    <div className="w-full border border-red-500">
      {posts.map((item) => (
        <h1 key={item.id}>{item.name}</h1>
      ))}
    </div>
  );
}

export default function Shit() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-purple-900 text-white">
      <h1>Hello fucking world</h1>
      <Link href="/">Go to Home</Link>
      <Suspense fallback={<div>Loading...</div>}>
        <ShitWithData />
      </Suspense>
    </div>
  );
}
