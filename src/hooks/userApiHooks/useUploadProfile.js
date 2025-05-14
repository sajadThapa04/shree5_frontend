import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import {uploadProfileImage} from "../../services/users.api";
import {useDispatch} from "react-redux";
import heic2any from "heic2any";

export const useProfileImageUpload = (onClose, onUserProfileImageUpdate) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'

  const mutation = useMutation({
    mutationFn: uploadProfileImage,
    onMutate: () => {
      setUploadStatus("uploading");
      toast.loading("Updating profile image...", {id: "profile-image-update"});
    },
    onSuccess: data => {
      queryClient.invalidateQueries(["currentUser"]);
      // Dispatch action to update Redux store
      if (
        data
        ?.data
          ?.profileImage) {
        dispatch({
          type: "user/updateProfileImage",
          payload: {
            profileImage: data.data.profileImage
          }
        });
      }
      toast.success(data.message || "Profile image updated successfully!", {id: "profile-image-update"});
      setUploadStatus("success");
      if (onUserProfileImageUpdate) {
        onUserProfileImageUpdate(data.data.profileImage);
      }
      setTimeout(() => {
        setUploadStatus(null);
        if (onClose) 
          onClose();
        }
      , 2000);
    },
    onError: error => {
      toast.error(error.message || "Failed to update profile image", {id: "profile-image-update"});
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  });

  const handleFileChange = async file => {
    try {
      let convertedFile = file;

      // Convert HEIC/HEIF to JPEG
      if (file.type === "image/heic" || file.type === "image/heif") {
        const blob = await heic2any({blob: file, toType: "image/jpeg", quality: 0.9});

        // Create a File from the converted blob
        convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpeg"), {
          type: "image/jpeg",
          lastModified: new Date().getTime()
        });
      }

      setSelectedFile(convertedFile);
      setUploadStatus(null);
    } catch (error) {
      toast.error("Failed to convert HEIC image. Please try again.");
      console.error("HEIC conversion error:", error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    await mutation.mutateAsync(selectedFile);
  };

  const resetFileState = () => {
    setSelectedFile(null);
    setUploadStatus(null);
  };

  return {
    selectedFile,
    isPending: uploadStatus === "uploading",
    isSuccess: uploadStatus === "success",
    isError: uploadStatus === "error",
    handleFileChange,
    handleSubmit,
    resetFileState,
    error: mutation.error
  };
};