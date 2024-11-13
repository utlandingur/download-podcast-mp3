import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    console.log("title", title);

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
    const filePath = path.resolve(downloadPath, `podcast-${index}.mp3`);
    const fileStream = fs.createWriteStream(filePath);
    // Pipe the response data into the file stream
    response.body.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log(`Downloaded: ${filePath}`);
    });
  } catch (e) {
    throw new Error(e);
  }
};

const downloadFiles = async (
  downloadPath: string,
  urls: string[]
): Promise<void> => {
  for (let i = 0; i < urls.length; i++)
    await downloadFile(downloadPath, urls[i], i);
};

const run = async () => {
  rl.question("Enter the URL for the podcast's RSS feed: ", async (url) => {
    rl.question(
      "Enter the number of latest podcasts to download: ",
      async (amount) => {
        rl.question(
          "Enter the download path (absolute or relative): ",
          async (downloadPath) => {
            const { title, links } = await fetchDownloadLinks(
              url,
              Number(amount)
            );
            const fullPath = path.resolve(downloadPath, title);
            if (!fs.existsSync(fullPath)) {
              fs.mkdirSync(fullPath, { recursive: true });
            }
            console.log("path", fullPath);
            downloadFiles(fullPath, links);
            rl.close();
          }
        );
      }
    );
  });
};

run();
