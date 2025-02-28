export const handleOpenWindow = async (url, target = "_blank") => {
  // NOTE: Already tried the documentPictureInPicture with iframe but it doesn't work, because most of the website refuse to be embeded in iframe

  const width =
    screen.availWidth < 1024
      ? screen.availWidth
      : screen.availWidth < 1200
        ? 1024
        : 1200;
  const height = screen.availHeight < 600 ? screen.availHeight : 600;
  const left = (screen.availWidth - width) / 2;
  const top = (screen.availHeight - height) / 2;

  const windowFeatures = `left=${left},top=${top},width=${width},height=${height},noreferrer,noopener`;

  window.open(url, target, windowFeatures);
};
