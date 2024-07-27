import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function MultipleSelect({
  user,
  status,
  searchResults,
  selectedUsers,
  setSelectedUsers,
  handleSearch,
}: {
  user: any;
  status: any;
  searchResults: any;
  selectedUsers: any;
  setSelectedUsers: any;
  handleSearch: any;
}) {
  return (
    <div className="w-full">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearch(e)}
        placeholder={"Select users"}
        isMulti
        formatOptionLabel={(user) => (
          <div className="flex w-full items-center gap-2">
            <img
              src={user.picture}
              alt="user avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <p>{user.label}</p>
          </div>
        )}
        styles={{
          control: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: "#202124",
            color: "#22c55e ",
            border: "none",
            outline: "none",
            boxShadow: isFocused && "none",
          }),
          placeholder: (styles) => ({
            ...styles,
            color: "#9ca3af",
          }),

          option: (styles, { isFocused }) => {
            return {
              ...styles,
              backgroundColor: isFocused ? "#22c55e" : "#202124",
              color: isFocused ? "#fff" : "#22c55e",
              outline: "none",
            };
          },

          input: (styles) => ({
            ...styles,
            color: "#22c55e",
          }),
        }}
      />
    </div>
  );
}

export default MultipleSelect;
