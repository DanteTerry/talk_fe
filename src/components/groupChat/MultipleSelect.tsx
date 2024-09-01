import Select from "react-select";
import { searchResult } from "../../types/types";
import { Dispatch, SetStateAction } from "react";

function MultipleSelect({
  searchResults,
  setSelectedUsers,
  handleSearch,
}: {
  status: string;
  searchResults: searchResult[];
  selectedUsers: searchResult[];
  setSelectedUsers: Dispatch<SetStateAction<searchResult[]>>;
  handleSearch: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div className="w-full">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearch(e)}
        placeholder={"Select users"}
        isMulti
        formatOptionLabel={(user: searchResult) => (
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
