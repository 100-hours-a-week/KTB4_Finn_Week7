const DEFAULT_PROFILE_IMAGE = "../../assets/image.png";

function hasImageUrl(imageUrl) {
  const normalizedUrl = String(imageUrl || "").trim().toLowerCase();

  return Boolean(
    normalizedUrl &&
    normalizedUrl !== "null" &&
    normalizedUrl !== "undefined"
  );
}

export function setProfileImage(imgElement, imageUrl) {
  if (!imgElement) {
    return;
  }

  imgElement.hidden = false;
  imgElement.src = hasImageUrl(imageUrl) ? imageUrl : DEFAULT_PROFILE_IMAGE;
}

export function setOptionalImage(imgElement, imageUrl) {
  if (!imgElement) {
    return;
  }

  if (!hasImageUrl(imageUrl)) {
    imgElement.hidden = true;
    imgElement.removeAttribute("src");
    return;
  }

  imgElement.hidden = false;
  imgElement.src = imageUrl;
}
