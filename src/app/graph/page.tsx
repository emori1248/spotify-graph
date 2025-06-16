import { api, HydrateClient } from "~/trpc/server";
import MusicSimilarityApp from "../_components/graph/MusicGraph";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default async function Page() {
  void api.spotify.getFavoritesFull.prefetch();

  return (
    <HydrateClient>
      <SignedIn>
        <MusicSimilarityApp />
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <SignInButton />
        </div>
      </SignedOut>
    </HydrateClient>
  );
}
