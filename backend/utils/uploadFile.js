import { v2 as cloudinary } from "cloudinary"

const uploadFile = async (publicId, resourceType, transformations) => {
  try {
    // Get metadata before transformation
    const originalMetadata = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    })

    const originalVersion = originalMetadata.version
    console.log("Original Version:", originalVersion)

    // Apply transformations and overwrite the file by using the same public_id
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      resource_type: resourceType,
      transformation: transformations,
      public_id: publicId, // Overwrite the original file with the same public_id
      format: "webp",
    })

    console.log("Transformed File URL:", result.secure_url)

    // Get metadata after transformation
    const transformedMetadata = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    })

    const transformedVersion = transformedMetadata.version
    console.log("Transformed Version:", transformedVersion)

    // Check if the version has changed (indicating overwriting)
    if (originalVersion !== transformedVersion) {
      console.log("The file has been successfully overwritten!")
    } else {
      console.log("The file was not overwritten.")
    }

    return result.secure_url
  } catch (error) {
    console.error(error)
    throw new Error(`Transformation failed: ${error.message}`)
  }
}

export default uploadFile
