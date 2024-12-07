import { Box, Typography } from "@mui/material";
import { Accept, DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type UploadDropZoneContainerProps = {
  onDrop: DropzoneOptions["onDrop"];
  accept: Accept;
  children: React.ReactNode;
} & Partial<DropzoneOptions>;

export const UploadDropZoneContainer: React.FC<UploadDropZoneContainerProps> = ({
  onDrop,
  children,
  maxFiles,
  accept,
  maxSize,
}) => {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles ?? 1,
    maxSize,
  });

  return (
    <Box sx={{ position: "relative" }} {...getRootProps()}>
      <input {...getInputProps()} style={{ display: "none" }} />
      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3))",
          color: "white",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          visibility: isDragActive ? "visible" : "hidden",
          opacity: isDragActive ? 1 : 0,
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 80 }} />
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Drop your files here or click to upload
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
