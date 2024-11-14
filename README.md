# Podcast Downloader

A simple Node.js script that downloads podcast episodes from provided RSS feed URLs. It fetches the podcast RSS feeds, extracts the episode URLs, and downloads the specified number of episodes.

## Requirements

- Node.js (v14 or higher)
- npm (or yarn)

## Inputs

- **PODCAST_RSS_FEEDS**: An array of podcast RSS feed URLs. You need to add your own RSS feed URLs here.
- **AMOUNT**: The number of episodes you want to download for each RSS feed.
- **DOWNLOAD_PATH** (Optional): The path where the downloaded episodes will be saved. Defaults to the current directory.

## How to Use

1. Download the repo
2. Run `npm install` or `yarn install`
3. Call `node dist/index.js`
4. Setup a simple cron job to run this regularly
