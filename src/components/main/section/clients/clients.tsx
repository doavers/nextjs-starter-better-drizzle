import { clientsData } from "@/data/clients-data";

import SingleClient from "./single-client";

const Clients = () => {
  return (
    <section className="pb-20 dark:bg-black">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="-mx-4 flex flex-wrap items-center justify-center gap-8 xl:gap-11">
          {clientsData.map((client, i) => (
            <SingleClient key={i} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
