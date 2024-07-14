import { useSelector } from "react-redux";

function VoiceCallContainer({ name }: { name: string }) {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div className="callBackground flex h-[91vh] w-1/2 items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="h-48 w-48 overflow-hidden rounded-full bg-green-400">
          <img src={user.picture} className="h-full w-full" />
        </div>
        <div className="flex flex-col items-center text-white">
          <p className="text-3xl capitalize">{name ? name : ""}</p>
          <p className="text-xl">02:30</p>
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
