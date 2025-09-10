import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const user = session ? session.user : null;

  return (
    <div className="m-5">
      <Navbar user={user} />
      <Hero />
    </div>

  );
}
