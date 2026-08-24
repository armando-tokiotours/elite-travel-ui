import { HomeExperience } from "@/components/HomeExperience";
import { fetchPosts } from "@/lib/wordpress";

export default async function Home() {
  const notes = await fetchPosts({ perPage: 24 });

  return <HomeExperience notes={notes} />;
}
