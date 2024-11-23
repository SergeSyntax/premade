export interface UploadRequestQuery {
  fileType: string;
  checksum: string;
}


export interface UploadResponse {
  url: string;
  key: string;
}
