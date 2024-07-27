function FileUploaderInput({ caption, setCaption }) {
  return (
    <input
      type="text"
      className="w-3/4 rounded-lg px-5 py-3 text-lg text-green-500 placeholder:text-gray-500 focus:outline-none dark:bg-[#202124]"
      placeholder="Add a caption..."
      value={caption}
      onChange={(e) => setCaption(e.target.value)}
    />
  );
}

export default FileUploaderInput;
