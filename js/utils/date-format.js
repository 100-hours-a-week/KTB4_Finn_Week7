export function formatDateTime(dateTime) {
  if (!dateTime) {
    return "";
  }

  return dateTime.split(".")[0].replace("T", " ");
}