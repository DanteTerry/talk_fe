import { FileText, Mic, Smile } from "lucide-react";

function Inputs() {
  return (
    <div className="row-span-1  flex items-center justify-between gap-5 border-t-2 px-5 dark:border-gray-700">
      <div className="flex gap-4">
        <FileText
          size={24}
          strokeWidth={1.8}
          className="course-pointer text-green-500 dark:text-white"
        />
        <Smile
          size={24}
          strokeWidth={1.8}
          className="course-pointer text-green-500 dark:text-white"
        />
      </div>

      <div className="relative w-full">
        <input
          type="text"
          className="w-full rounded-md bg-[#f0f2f5] px-4 py-2 pr-12 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Type a message..."
        />
        <div className="cursor-pointer">
          <Mic
            size={25}
            strokeWidth={1.5}
            className="course-pointer absolute right-3 top-2 text-green-500"
          />
        </div>
      </div>
    </div>
  );
}

export default Inputs;
