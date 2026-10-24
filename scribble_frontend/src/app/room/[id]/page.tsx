import { Suspense } from "react";
import GameScreen from "@/components/GameScreen";

type RoomPageProps = { params: Promise<{ id: string }> };

const RoomContent = async ({ params }: RoomPageProps) => {
  const { id } = await params;

  return (
    <div className="bg-[url('/img/background.png')] flex h-screen w-screen flex-col">
      <GameScreen id={id} />
    </div>
  );
};

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-[url('/img/background.png')] h-screen w-screen">
          Loading room...
        </div>
      }
    >
      <RoomContent params={params} />
    </Suspense>
  );
}