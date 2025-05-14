import { useProfileImageUpload } from "../../hooks/userApiHooks/useUploadProfile";
import FileUploader from "../features/FileUploader/FIleUploader";
import { Button } from "../Ui";

const UploadProfileImageForm = ({
  user,
  onClose,
  onUserProfileImageUpdate,
}) => {
  const {
    selectedFile,
    isPending,
    isSuccess,
    isError,
    handleFileChange,
    handleSubmit,
    resetFileState,
    error,
  } = useProfileImageUpload(onClose, onUserProfileImageUpdate);

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-6">
          <FileUploader
            id="profile-image-upload"
            onUpload={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
            disabled={isPending}
            className="w-full"
            initialImage={user?.profileImage} // Make sure this is correct
            isUploading={isPending}
            isSuccess={isSuccess}
            isError={isError}
          >
            {selectedFile ? selectedFile.name : "Choose an image"}
          </FileUploader>

          {/* Status indicators */}
          {/* {isPending && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Uploading your image...</span>
            </div>
          )} */}
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-600">
              <span>✓ Upload successful!</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-red-600">
              <span>✗ Upload failed: {error?.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                resetFileState();
                onClose?.();
              }}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedFile || isPending}
              isLoading={isPending}
              className="flex-1"
            >
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        {!selectedFile && (
          <p className="text-sm text-center text-gray-500">
            JPEG, PNG, or WEBP. Max 15MB.
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadProfileImageForm;
