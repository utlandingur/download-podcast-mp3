#!/usr/bin/env node

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// ------------------- DEFAULT VALUES ------------------
const PODCAST_RSS_FEEDS = process.env.PODCAST_RSS_FEEDS
  ? process.env.PODCAST_RSS_FEEDS.split(",")
  : [];
const AMOUNT = process.env.AMOUNT ? parseInt(process.env.AMOUNT, 10) : 5;
const DOWNLOAD_PATH = process.env.DOWNLOAD_PATH || ".";

// ------------------- THE SCRIPT ------------------

const fetchDownloadLinks = async (url: string, amount: number) => {
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
    console.error(e);
  }
};

const downloadFile = async (
  downloadPath: string,
  url: string,
  index: number
) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }
    const filePath = path.resolve(downloadPath, `podcast-${index + 1}.mp3`);
    const fileStream = fs.createWriteStream(filePath);
    response.body.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log(`Downloaded: ${filePath}`);
    });
  } catch (e) {
    console.error(e);
  }
};

const downloadFiles = async (
  downloadPath: string,
  amount: number,
  urls: string[]
) => {
  for (let i = 0; i < urls.length; i++) {
    await downloadFile(downloadPath, urls[i], i);
  }
};

const run = async (
  podcastURLs: string[],
  amount: number,
  downloadPath: string
) => {
  for (let i = 0; i < podcastURLs.length; i++) {
    const { title, links } = await fetchDownloadLinks(podcastURLs[i], amount);
    const fullPath = path.resolve(downloadPath, title);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    await downloadFiles(fullPath, amount, links);
  }
};

const argv = yargs(hideBin(process.argv))
  .option("rss", {
    alias: "r",
    type: "array",
    description: "Comma-separated list of podcast RSS feed URLs",
    demandOption: true,
  })
  .option("amount", {
    alias: "a",
    type: "number",
    description: "Number of episodes to download",
    default: 5,
  })
  .option("path", {
    alias: "p",
    type: "string",
    description: "Path to save downloaded podcasts",
    default: "./downloads",
  }).argv;

run(argv.rss as string[], argv.amount, argv.path);
