import React, { useMemo, useState } from "react"
import useAuth from "../../../hooks/useAuth"
import UpdateDisplayName from "./UpdateDisplayName"
import UpdateDateOfBirth from "./UpdateDateOfBirth"
import UpdateBio from "./UpdateBio"
import UpdateLocation from "./UpdateLocation"
import UpdateGender from "./UpdateGender"
import UpdateInterests from "./UpdateInterests"

const InfoDetails = () => {
  const { user } = useAuth()

  return (
    <div className="mt-2 pl-4">
      <UpdateDisplayName currentDisplayName={user?.displayName} />
      <UpdateDateOfBirth currentDateOfBirth={user?.dateOfBirth} />
      <UpdateBio currentBio={user?.bio} />
      <UpdateLocation currentLocation={user?.location} />
      <UpdateGender currentGender={user?.gender} />
      <UpdateInterests currentInterests={user?.interests} />
    </div>
  )
}

export default InfoDetails
