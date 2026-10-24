import AvatarRow from "@/components/AvatarRow";
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

        {/* Card */}
        <div className="mt-12 flex w-[500px] max-w-full flex-col gap-3 bg-black/20 p-[18px]">
          <div className="h-[42px]" />

          <div className="h-[150px] bg-black/20" />

          <div className="h-[130px]" />
        </div>
      </main>

      <section className="min-h-[40vh] w-full bg-[#3b1b95]"></section>
    </>
  );
}