import { useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, Container, Stack, Typography } from "@mui/material";
import { getUploadUrl } from "@/auth/api/uploadUrl";
import axios from "axios";

export const MediaUpload = () => {
  // return ''
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload: DropzoneOptions["onDrop"] = (acceptedFiles, fileRejections) => {
    console.log(fileRejections);

    const formData = new FormData();
    const [file] = acceptedFiles ?? [];
    if (file) {
      formData.append("file", file);
      getUploadUrl(file.type).then(async (res) => {
        const { key, url } = res.data;

        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        await axios.post("/api/media", {
          title: "title",
          describe: "desc",
          url: key,
        });
      });
      // fetch(url, {
      //   method: "POST",
      //   body: formData,
      // })
      //   .then((res) => {
      //     if (res.ok) {
      //       setFile(file);
      //     } else {
      //       console.error("Failed to upload:", res);
      //     }
      //   })
      //   .catch(console.error);
      setFiles((prevFiles) => [...prevFiles, file]);
    } else {
      console.error("No valid files accepted");
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop: handleUpload,
    accept: {
      "video/mp4": [".mp4"],
      "video/mpeg": [".mpeg"],
      "video/webm": [".webm"],
    },
    maxFiles: 1,
    onError: (err) => {
      console.log("onError");
      console.log(err);
    },
    // maxSize: 4 * (1024 ^ 3),
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {files.map((file, index) => (
          <Typography key={index} variant="body1">
            {file.name}
          </Typography>
        ))}
      </Stack>
      <div>
        <div {...getRootProps()}>
          <label htmlFor="upload-video">
            <input {...getInputProps()} />
            <Button
              endIcon={<CloudUploadIcon />}
              startIcon={<FileUploadIcon />}
              variant="contained"
              component="span"
            >
              Select Files
            </Button>
          </label>
          {isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop files here</p>}
        </div>
      </div>
      {fileRejections.length > 0 && (
        <div>
          <div>
            <Typography color="red" variant="body2">
              {fileRejections[0].errors[0]?.message}
            </Typography>
          </div>
        </div>
      )}
    </Container>
  );
};
