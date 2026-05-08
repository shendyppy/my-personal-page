import { getAbout } from "@/server/queries/about";
import { AboutSection } from "@/components/organisms/AboutSection";

export const About = async () => {
  const data = await getAbout();
  return <AboutSection initialData={data} />;
};
