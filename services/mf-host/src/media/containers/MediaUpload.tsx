import { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, Container, Stack } from "@mui/material";

export const MediaUpload = () => {
  const [file, setFile] = useState<FileList | null>();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stack direction="row" alignItems="center" spacing={2}></Stack>
      <div>
        <div {...getRootProps()}>
          <label htmlFor="upload-video">
            <input {...getInputProps()} />
            <Button variant="contained" component="span">
              Select Files
            </Button>
          </label>

          {isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop files here</p>}
        </div>
      </div>
    </Container>
  );
};
