import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// ------------------- INPUTS ------------------

// REQUIRED - Copy your Podcast RSS Feeds into here
const PODCAST_RSS_FEEDS: string[] = [
  "https://feeds.simplecast.com/Urk3897_",
  "https://feeds.megaphone.fm/GLT9487939818",
];

// REQUIRED - Enter the number of episodes you want downloading
const AMOUNT: number = 5;

// OPTIONAL - Enter the path to the folder you want the podcasts to go in.
const DOWNLOAD_PATH: string = "../../podcasts";

// ------------------- THE SCRIPT ----------------

const fetchDownloadLinks = async (
  url: string,
  amount: number
): Promise<{ title: string; links: string[] }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const text = await response.text();
    const title = text.match(/<title>([^<]*)</)[1];
    const enclosureTags = text.match(/<enclosure[^>]*>/g);
    let links: string[] = [];
    for (let i = 0; i < amount; i++) {
      links.push(enclosureTags[i].match(/url="([^"]*)"/)[1]);
    }

    return { title, links };
  } catch (e) {
    throw new Error(e);
  }
};

const downloadFile = async (
  downloadPath: string,
  url: string,
  index: number
): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }
    const filePath = path.resolve(downloadPath, `podcast-${index + 1}.mp3`);

    const fileStream = fs.createWriteStream(filePath);
    // Pipe the response data into the file stream
    response.body.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log(`Downloaded podcast at: ${filePath}`);
    });
  } catch (e) {
    console.error(e);
  }
};

const downloadFiles = async (
  downloadPath: string,
  amount: number,
  urls: string[]
): Promise<void> => {
  let count = amount - 1;
  for (let i = 0; i < urls.length; i++, count--)
    await downloadFile(downloadPath, urls[i], count);
};

const run = async (
  podcastURLs: string[],
  amount: number,
  downloadPath?: string
) => {
  for (let i = 0; i < podcastURLs.length; i++) {
    const { title, links } = await fetchDownloadLinks(podcastURLs[i], amount);
    const fullPath = path.resolve(downloadPath ?? "./", title);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    downloadFiles(fullPath, amount, links);
  }
};

if (PODCAST_RSS_FEEDS && AMOUNT) {
  run(PODCAST_RSS_FEEDS, AMOUNT, DOWNLOAD_PATH);
}
