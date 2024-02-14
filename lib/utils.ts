import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(path: string, title: string, id: number) {
  const slug = title.toLocaleLowerCase().split(" ").join("-");
  return `${path}/${slug}-${id}`;
}

export function getIdFromSlug(slug: string) {
  let id = "";
  loop: for (let i = slug.length - 1; i >= 0; i--) {
    if (slug[i] === "-") {
      break loop;
    } else {
      id = slug[i] + id;
    }
  }
  return parseInt(id, 10);
}

export function getYouTubeEmbedURL(url: string | null) {
  if (!url) return "";

  const playbackId = url.includes("/watch?v=")
    ? url.split("/watch?v=")[1]
    : url.includes(".be/")
    ? url.split(".be/")[1]
    : url.includes("?feature=share")
    ? url.split("shorts/")[1].split("?feature=share")[0]
    : url.includes("shorts/")
    ? url.split("shorts/")[1]
    : "";

  const embedUrl = playbackId
    ? "https://www.youtube.com/embed/" + playbackId
    : url;

  return embedUrl;
}
