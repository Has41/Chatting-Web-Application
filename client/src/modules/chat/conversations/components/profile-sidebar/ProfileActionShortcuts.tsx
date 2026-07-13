import { profileInfoData } from "@shared/utils/dynamicData"

const ProfileActionShortcuts = () => (
  <div className="mt-4 w-full px-6">
    <div className="flex justify-around">
      {profileInfoData.map((item) => (
        <div key={item.name} className="flex cursor-pointer flex-col items-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-white shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="text-custom-text size-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
        </div>
      ))}
    </div>
  </div>
)

export default ProfileActionShortcuts
