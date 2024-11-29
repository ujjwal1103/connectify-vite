function CheckBox({ isMessageSelected, handleSelectMessage }: any) {
  return (
    <div className="flex items-center justify-center p-2">
      <input
        type="checkbox"
        className="size-4 dark:bg-black"
        checked={isMessageSelected}
        onChange={handleSelectMessage}
      />
    </div>
  )
}

export default CheckBox
