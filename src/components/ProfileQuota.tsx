const ProfileQuota = () => {
  const used = 30
  const remaining = 70
  return (
    <div className="p-4 w-full">
      <div className="mx-auto max-w-4xl flex flex-col overflow-hidden">
        <div className="h-4 flex flex-row rounded-full overflow-hidden">
          <span className="bg-purple-400" style={{ width: `${used}%` }}></span>
          <span className="bg-green-400" style={{ width: `${remaining}%` }}></span>
        </div>
        <div className="flex flex-row gap-2 text-xs text-gray-500">
          <div className="p-2 flex flex-row items-baseline gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <div>{`Used ${used}%`}</div>
          </div>
          <div className="py-2 flex flex-row items-baseline gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div>{`Remaining ${remaining}%`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileQuota
