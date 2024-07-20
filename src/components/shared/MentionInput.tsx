import { useClickOutside, useDebouncedState } from "@react-hookz/web";
import { SetStateAction, forwardRef, useEffect, useRef, useState } from "react";
import { makeRequest } from "../../config/api.config";

type MentionInputProps = {
  text?: string;
  setText: SetStateAction<any>;
  placeholder: string;
  setCursorPosition: SetStateAction<any>;
  onClick: (event: any)=>void;
  onBlur: VoidFunction;
  mentionedUsers: any;
  setMentionedUsers: SetStateAction<any>;
};

const MentionInput = (
  {
    text,
    setText,
    placeholder,
    setCursorPosition,
    onClick,
    onBlur,
    mentionedUsers,
    setMentionedUsers,
  }: MentionInputProps,
  ref: any
) => {
  const [query, setQuery] = useDebouncedState("", 600, 500);
  const [users, setUsers] = useState([]);
  const [mentionStartIndex, setMentionStartIndex] = useState<number | undefined>();
  const mentionBoxRef = useRef<any>();
  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue.trim() === "") {
      setMentionedUsers([]);
    }
    setText(inputValue);
    setCursorPosition(e.target.selectionStart);

    // Detect "@" symbol in the input
    const atIndex = inputValue.lastIndexOf("@");

    if (atIndex !== -1) {
      // "@" found at the end, consider it a mention trigger
      const spaceIndex = inputValue.indexOf(" ", atIndex);
      const mentionQuery =
        spaceIndex !== -1
          ? inputValue.substring(atIndex + 1, spaceIndex)
          : inputValue.substring(atIndex + 1);
      setMentionStartIndex(atIndex);
      setQuery(mentionQuery);
    } else {
      setMentionStartIndex(undefined);
      setQuery("");
    }

    const remainingUsers = mentionedUsers.filter((user: any) =>
      inputValue.includes(`${user}`)
    );
    setMentionedUsers(remainingUsers);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = (await makeRequest(`/users/search?query=${query}`)) as any;
        if (res.isSuccess) {
          setUsers(res.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (query) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [query]);

  const handleUserClick = (selectedUsername: string) => {
    const user = mentionedUsers.some((u: any) => u === selectedUsername);
    if (!user) {
      setMentionedUsers((prev: any) => [...prev, selectedUsername]);
    }

    const nextSpaceIndex = text!.indexOf(" ", mentionStartIndex);

    const insertionIndex = nextSpaceIndex !== -1 ? nextSpaceIndex : text!.length;

    const updatedText =
      text!.slice(0, mentionStartIndex) +
      selectedUsername +
      text!.slice(insertionIndex);

    setText(updatedText.trim());
    setMentionStartIndex(undefined);
    setUsers([]);
    ref.current.focus();
  };

  useClickOutside(mentionBoxRef, () => {
    setMentionStartIndex(undefined);
    setUsers([]);
  });

  return (
    <div className="flex w-full">
      <textarea
        onChange={handleInputChange}
        value={text}
        className="bg-transparent scrollbar-none  p-2 border-none w-full h-full focus:outline-none resize-none text-sm"
        ref={ref}
        rows={1}
        placeholder={placeholder}
        onClick={onClick}
        onBlur={onBlur}
      />

      {mentionStartIndex !== null && users.length > 0 && (
        <div
          ref={mentionBoxRef}
          className="p-2 absolute bottom-12 divide-y-2 scrollbar-none dark:divide-gray-800 divide-gray-300 z-10 w-96 mt-2 dark:bg-zinc-950 bg-white shadow-md rounded-md h-auto min-h-fit max-h-52 overflow-y-scroll"
        >
          {users.map((u: any) => (
            <div
              className="p-1"
              key={u._id}
              onClick={() => handleUserClick(u.username)}
            >
              {u.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default forwardRef(MentionInput);
