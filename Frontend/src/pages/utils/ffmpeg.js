import { FFmpeg } from "@ffmpeg/ffmpeg";

const createFFmpeg = (options) => new FFmpeg(options);
const fetchFile = async (input) => {
  if (input instanceof Blob) {
    return new Uint8Array(await input.arrayBuffer());
  }
  const response = await fetch(input);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};


// ✅ Initialize FFmpeg (loads from CDN — no local files needed)
const ffmpeg = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

// 🎥 Convert uploaded video to MP4
export async function transcodeVideo(file) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, "output.mp4");
  const data = ffmpeg.FS("readFile", "output.mp4");

  return new Blob([data.buffer], { type: "video/mp4" });
}

// 🎧 Extract audio (MP3) from video
export async function extractAudio(file) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, "-q:a", "0", "-map", "a", "output.mp3");
  const data = ffmpeg.FS("readFile", "output.mp3");

  return new Blob([data.buffer], { type: "audio/mp3" });
}
