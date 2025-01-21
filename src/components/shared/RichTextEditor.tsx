import { cn } from '@/lib/utils'
const classes =
  'bg-red-400  text-wrap p-2 overflow-y-scroll relative focus:outline-none'
const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write a caption...',
  className = classes,
}: any) => {
  return (
    <div className="relative flex h-full max-h-44 w-full flex-1 md:max-h-64">
      {/* {textContent === '' && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="pointer-events-none absolute left-0 top-0 text-gray-400"
        >
          {placeholder}
        </motion.span>
      )} */}
      <textarea
        value={value}
        placeholder={placeholder}
        className={cn(className, 'resize-none bg-transparent')}
        tabIndex={1}
        onChange={(e: any) => {
          onChange(e.target.value)
        }}
      ></textarea>
    </div>
  )
}

export default RichTextEditor
