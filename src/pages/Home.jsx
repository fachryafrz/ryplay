import HomeFilters from "../components/HomeFilters";
import HomeSlider from "../components/HomeSlider";
import Slider from "../components/Slider";

export default function Home() {
  return (
    <div className={`container mx-auto p-4 px-24 flex flex-col gap-10`}>
      <HomeFilters />

      <HomeSlider />

      <Slider title={`New games`} />
    </div>
  );
}
