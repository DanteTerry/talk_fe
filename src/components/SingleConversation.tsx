import { trimString } from "../lib/utils/utils";

function SingleConversation() {
  return (
    <div className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3">
      <div className="h-12!important w-12 rounded-full">
        <img
          src="https://gravatar.com/avatar/d6771c28560592154cf60f8bea68d484?s=400&d=retro&r=x"
          alt="user avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <span className="text-white">John Doe</span>
          <span className="text-[13px] text-white">
            {trimString("Hello how are you i am good what about you")}
          </span>
        </div>
        <span className="justify-start text-xs text-white">02:30 AM</span>
      </div>
    </div>
  );
}

export default SingleConversation;
