import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { auth, createInternalClients } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {

  // console.log("HELLOOO")
  // try {
  //   console.log("creating...");
  //   const resp = await createInternalClients(await headers())
  //   console.log("created:");
  //   console.log(resp)
  //
  // } catch (e) {
  //   console.log("err:")
  //   console.error(e);
  // }
  // try {
  //   const data = await auth.api.getOAuthClients({
  //     headers: await headers(),
  //   });
  //   console.log("Clients:", data);
  // } catch (e) {
  //   console.log("E:", e);
  // }

  return (
    <Hero />
  );
}
