const fetchURLs = async (url: string): Promise<string[]> => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const text = await response.text();

    // const podcastTitle = xml.rss.channel.title;
    // console.log("Podcast Title: ", podcastTitle);

    // const podcastLinks = xml.rss.channel.item
    //   .map((item: any) => {
    //     if (item.enclosure && item.enclosure.url) {
    //       return item.enclosure.url;
    //     } else {
    //       console.warn("No enclosure URL found for item:", item);
    //       return null;
    //     }
    //   })
    //   .filter((url: string | null) => url !== null);

    // console.log("Podcast Links: ", podcastLinks);
    return podcastLinks;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const run = async () => {
  await fetchURLs("https://feeds.simplecast.com/Urk3897_");
};

run();
