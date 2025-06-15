import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { api, HydrateClient } from "~/trpc/server";
import { SpotifyAlbumSearch } from "./_components/SpotifyAlbumSearch";
import Greeting from "./_components/Greeting";

export default async function Home() {
  // const hello = await api.spotify.hello();

  void api.spotify.getFavorites.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Spotify</span> Thing
          </h1>
          <SignedIn>
            <div className="flex flex-row gap-4">
              <UserButton />
              <Greeting />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <div className="flex w-full max-w-4xl flex-row gap-1">
            <SpotifyAlbumSearch />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
