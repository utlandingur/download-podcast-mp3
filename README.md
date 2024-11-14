# Podcast Downloader

A simple Node.js CLI tool that downloads podcast episodes from provided RSS feed URLs. It fetches the podcast RSS feeds, extracts the episode URLs, and downloads the specified number of episodes.

This tool can be run directly from the command line without any installation, making it easy for anyone to use and automate podcast downloads.

## Features

- Fetches podcast RSS feeds.
- Extracts and downloads podcast episodes as MP3 files.
- Configurable number of episodes to download.
- Saves episodes to a specified directory.

## Requirements

- **Node.js** (v14 or higher)
- **npm** or **yarn**

No need for any repository setup – just run it as a global CLI tool.

## Inputs

- **`rss`** (Required): A comma-separated list of podcast RSS feed URLs (e.g., `--rss https://example.com/feed1 https://example.com/feed2`).
- **`amount`** (Optional): The number of episodes you want to download from each podcast feed. Defaults to 5.
- **`path`** (Optional): The directory where the downloaded episodes will be saved. Defaults to current directory.

## How to Use

### Option 1 (RECOMMENDED): Running Directly from Command Line (Global Tool)

1. Install the tool globally by running:

```bash
npm install -g podcast-rss-cli-tool
```

2. Use the command with your desired podcast RSS feed URLs:

```bash
podcast-downloader --rss "https://example.com/feed1" "https://example.com/feed2" --amount 5 --path ./podcasts
```

This will download 5 episodes from each feed and save them to the ./podcasts directory.

### Option 1: Running from a Project

1. Clone or download the repo on your local machine
2. Run the following script

```bash
node dist/index.js --rss "https://example.com/feed1" "https://example.com/feed2" --amount 5 --path ./downloads
```

Replace the RSS URLs with desired podcast feeds.

## Scheduling the script

If you want to automatically run the script at regular intervals, you can set up a cron job.

1. Open your crontab file

```bash
crontab -e
```

2. Add a cron job to run at set times/days (e.g. everyday at 9 AM)

```bash
0 9 * * * podcast-downloader --rss "https://example.com/feed1" "https://example.com/feed2" --amount 5 --path ./downloads
```

## Example command

```bash
podcast-downloader --rss "https://example.com/feed1" "https://example.com/feed2" --amount 3 --path ./mypodcasts
```

This command will

- Fetch the 3 most recent episodes from each podcast RSS FEED.
- Save the episodes to the `./mypodcasts` folder

## Troubleshooting

- **No episodes downloaded**: Make sure the provided RSS feed URLs are correct and accessible.
- **Permission errors**: Ensure that you have write permissions to the specified download path.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
