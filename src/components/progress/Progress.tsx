const ProgressBar = ({
  value,
  max = 100,
  color = 'bg-blue-500',
  height = 'h-4',
}: any) => {
  const percentage = (value / max) * 100

  return (
    <div className={`w-full ${height} bg-gray-200`}>
      <div
        className={`${color} ${height} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar
