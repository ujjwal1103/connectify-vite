import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
const classes =
  "bg-red-400  text-wrap p-2 overflow-y-scroll relative focus:outline-none";
const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write a caption...",
  className = classes,
}: any) => {
  const [textContent, setTextContent] = useState(value);

  return (
    <div className="relative flex-1 h-full w-full flex md:max-h-64 max-h-44 ">
      {textContent === "" && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute top-0 left-0 text-gray-400 pointer-events-none"
        >
          {placeholder}
        </motion.span>
      )}
      <div
        className={cn(className)}
        contentEditable={true}
        content={value}
        tabIndex={1}
        onInput={(e: any) => {
          setTextContent(e.target.textContent);
          onChange(e.target.innerText);
        }}
      ></div>
    </div>
  );
};

export default RichTextEditor;
