import { useState } from "react"
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"
import { ROOT_FOLDER } from "../../constants/constantValues"

const TestFileUpload = () => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState("image")
  const { uploadFile, isUploading, error: uploadError, uploadedFileUrl } = useCloudinaryUpload()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value)
  }

  const handleUpload = async () => {
    if (file) {
      uploadFile(file, `${ROOT_FOLDER}/temp-uploads`, fileType)
      console.log(file)
    }
  }

  return (
    <div>
      <h1>Test File Upload</h1>

      <select onChange={handleFileTypeChange} value={fileType}>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
        <option value="other">Other</option>
      </select>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : `Upload ${fileType}`}
      </button>

      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}

      {uploadedFileUrl && (
        <div>
          <p>File uploaded successfully:</p>
          {fileType === "image" && <img src={uploadedFileUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />}
          {fileType === "video" && <video src={uploadedFileUrl} controls style={{ maxWidth: "300px" }} />}
          {fileType === "audio" && <audio src={uploadedFileUrl} controls />}
          {fileType === "other" && (
            <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default TestFileUpload
