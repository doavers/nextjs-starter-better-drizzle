import Image from "next/image";

import { Testimonial } from "@/types/frontend/testimonial";

const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
    <path d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z" />
  </svg>
);

const SingleTestimonial = ({ testimonial }: { testimonial: Testimonial }) => {
  const { star, name, image, content, designation } = testimonial;

  const ratingIcons = [];
  for (let index = 0; index < star; index++) {
    ratingIcons.push(
      <span key={index} className="text-[#fbb040]">
        {starIcon}
      </span>,
    );
  }

  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div
        className="shadow-testimonial rounded-xl bg-white px-4 py-[30px] sm:px-[30px] dark:bg-black"
        data-wow-delay=".1s"
      >
        <div className="mb-[18px] flex items-center gap-[2px]">{ratingIcons}</div>

        <p className="mb-6 text-base dark:text-gray-200">“{content}</p>

        <div className="flex items-center gap-4">
          <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
            <Image src={image} alt={name} width={50} height={50} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">{name}</h3>
            <p className="text-body-secondary text-xs">{designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestimonial;
