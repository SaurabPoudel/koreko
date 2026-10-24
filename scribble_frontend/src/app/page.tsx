import AvatarRow from "@/components/AvatarRow";
import PlayerCard from "@/components/PlayerCard";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex w-full flex-col items-center bg-[#4a2c9a] bg-[url('/img/background.png')] bg-center px-4 pb-6 pt-[30px]">
        <Image
          src="/img/logo.gif"
          alt="Logo"
          width={590}
          height={120}
          priority
          unoptimized
          className="h-auto w-[590px] max-w-full object-contain"
        />

        <div className="mt-5">
          <AvatarRow />
        </div>

        <div className="mt-12 ">
        <PlayerCard/>
        </div>
      </main>

      <section className="min-h-[40vh] w-full bg-[#3b1b95]"></section>
    </>
  );
}