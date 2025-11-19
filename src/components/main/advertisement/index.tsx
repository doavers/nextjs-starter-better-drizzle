import { AdvertisementHorizontal } from "./horizontal";
import { AdvertisementVertical } from "./vertical";

export const Advertisement = ({ type }: { type?: string }) => {
  return (
    <div className="container mx-auto w-full">
      <div className="rounded-xl bg-black/10 py-4 text-center text-black/60 dark:text-white/60">
        {type === "vertical" ? <AdvertisementVertical /> : <AdvertisementHorizontal />}
      </div>
    </div>
  );
};
