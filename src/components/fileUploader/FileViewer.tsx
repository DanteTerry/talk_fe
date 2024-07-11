import { Plus, SendHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import { formatKbSize, trimFileName } from "../../lib/utils/utils";

function FileViewer() {
  const { files } = useSelector((state) => state.chat);

  console.log(files[0].type);
  const fileType = `../../assets/uploader/${files[0].type}.svg`;
  console.log(fileType);

  return (
    <div className="h-full w-full px-10">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="flex h-[380px] w-[319px] flex-col items-center justify-end gap-2 overflow-hidden rounded-xl">
          {files[0].type === "IMAGE" ? (
            <img
              className="w-full rounded-xl object-cover"
              src={files[0].fileData}
              alt={files[0].file.name}
            />
          ) : (
            <img
              className="w-3/4 rounded-xl object-cover"
              src={`../../../public/uploader/${files[0].type}.svg`}
              alt={files[0].file.name}
            />
          )}

          <div className="flex flex-col">
            <h2 className="text-center text-lg font-semibold text-gray-700 dark:text-green-500">
              {`${trimFileName(files[0].file.name)}.${files[0].file.name.split(".")[1]}`}
            </h2>

            <h3 className="text-center font-semibold text-gray-700 dark:text-white">
              Size : {formatKbSize(files[0].file.size)}
            </h3>
          </div>
        </div>
        <input
          type="text"
          className="w-3/4 rounded-lg px-5 py-3 text-lg text-green-500 placeholder:text-gray-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Add a caption..."
        />

        <div className="mt-2 flex w-full items-center justify-center gap-3">
          <div className="flex w-full justify-center gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="group relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl"
              >
                {files[0].type === "IMAGE" ? (
                  <img
                    className="h-full w-full rounded-xl object-cover"
                    src={files[0].fileData}
                    alt={files[0].file.name}
                  />
                ) : (
                  <img
                    className="h-full w-full rounded-xl object-cover"
                    src={`../../../public/uploader/${files[0].type}.svg`}
                    alt={files[0].file.name}
                  />
                )}

                <X
                  className="absolute right-1 top-1 cursor-none opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:cursor-pointer"
                  size={20}
                  strokeWidth={2}
                />
              </div>
            ))}

            <div className="group relative grid h-16 w-16 cursor-pointer place-items-center rounded-xl dark:bg-[#202124]">
              <Plus strokeWidth={2.5} size={30} />
            </div>
          </div>
          <button className="w-[64px]!important h-[64px]!important rounded-full bg-green-500 p-3">
            <SendHorizontal strokeWidth={2} size={35} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileViewer;
