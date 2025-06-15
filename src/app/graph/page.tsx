import { HydrateClient } from "~/trpc/server";
import MusicSimilarityApp from "../_components/graph/MusicGraph";

export default async function Page() {
  return (
    <HydrateClient>
      <MusicSimilarityApp />
    </HydrateClient>
  );
}
