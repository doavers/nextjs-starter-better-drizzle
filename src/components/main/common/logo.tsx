import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="mr-3 flex items-center gap-2 md:mr-0">
      <Image src={"/images/logo/logo.png"} width={130} height={40} alt="brand" />
      <p className="text-2xl font-bold"></p>
    </Link>
  );
};

export default Logo;
