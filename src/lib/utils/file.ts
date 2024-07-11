export const getFileType = (file: string) => {
  switch (file) {
    case "text/plain":
      return "TXT";
    case "application/pdf":
      return "PDF";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";
    case "application/msword":
      return "DOCX";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "XLSX";
    case "application/vnd.ms-excel":
      return "XLSX";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "PPTX";
    case "application/vnd.ms-powerpoint":
      return "PPTX";
    case "video/mp4":
      return "MP4";
    case "video/mpeg":
      return "MPEG";
    case "video/ogg":
      return "OGG";
    case "video/quicktime":
      return "MOV";
    case "video/webm":
      return "WEBM";
    case "audio/mpeg":
      return "MP3";
    case "audio/ogg":
      return "OGG";
    case "audio/wav":
      return "WAV";
    case "application/zip":
    case "application/x-rar-compressed":
    case "application/x-7z-compressed":
    case "application/x-tar":
    case "application/x-gzip":
      return "ARCHIVE";
    default:
      return "IMAGE";
  }
};
