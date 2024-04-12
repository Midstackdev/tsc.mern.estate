import * as path from "path";

export const appRootPath = path.join(__dirname, "../../");
export const srcRootPath = path.join(__dirname, "../../../");
export const rootPath = path.resolve(__dirname, "../../../../../");

export const __root__ = require?.main?.paths[0]
  .split("node_modules")[0]
  .slice(0, -1);

type Language = {
  name: string;
  iso: string;
  enabled: boolean;
  default: boolean;
  nativeName: string;
};

export const definedLanguages: Record<string, Language> = {
  english: {
    name: "English",
    iso: "en",
    enabled: true,
    default: true,
    nativeName: "English",
  },
  french: {
    name: "French",
    nativeName: "Français",
    iso: "fr",
    default: true,
    enabled: true,
  },
  spanish: {
    name: "Spanish",
    iso: "es",
    enabled: true,
    default: true,
    nativeName: "Español",
  },
};

export const generateLanguageObjects = (languages: string[]): Language[] => {
  return languages
    .map((language) => definedLanguages[language.toLowerCase()])
    .filter((language) => language !== undefined) as Language[];
};

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const isNullOrUndefined = (value: any) => {
  return value === undefined || value === null;
};

export const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export const getDatesFromDateRange = (from: Date, to: Date) => {
  const days = [];
  for (let d = from; d <= to; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
};

const getDelayedRequest = (
  url: string,
  options: Record<string, string>,
  delay: number
) =>
  new Promise((resolve, reject) => {
    console.log(`Get request for url ${url}`);
    setTimeout(async () => {
      const response = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options,
        },
      });
      if (!response.ok) {
        console.log("----error response----", response.statusText);
        const data = {};
        resolve(data);
        return;
      }
      const data = await response.json();
      console.log(
        `Finished action for ${url} returned reponse ${response.status}`
      );
      resolve(data);
    }, delay);
  });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_NB_RETRY = 5;
const RETRY_DELAY_MS = 200;

export default async function fetchRetry(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  let retryLeft = MAX_NB_RETRY;
  while (retryLeft > 0) {
    try {
      const response = await fetch(input, init);
      if (!response.ok) {
        throw new Error("bad response");
      }
      return response;
    } catch (err) {
      await sleep(RETRY_DELAY_MS);
    } finally {
      retryLeft -= 1;
    }
  }
  throw new Error(`Too many retries`);
}

// const start = new Date(2023, 11, 14);
// // const end = new Date(2023, 9, 20);
// const end = new Date(2023, 11, 20);

// const datesArray = getDatesFromDateRange(start, end);
