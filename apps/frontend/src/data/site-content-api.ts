type UnknownRecord = Record<string, unknown>;

const DEFAULT_CONTENT_API_ENDPOINT =
  "https://pixoloproductions.com/pixsheetdata/index.php?project=chinook-school";

const CONTENT_API_ENDPOINT = import.meta.env.PUBLIC_CONTENT_API_URL || DEFAULT_CONTENT_API_ENDPOINT;

let fullContentCachePromise: Promise<UnknownRecord | null> | null = null;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapContentPayload(payload: unknown): UnknownRecord | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (isRecord(payload.data)) {
    return payload.data;
  }

  return payload;
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch content (${response.status})`);
  }

  return response.json();
}

async function fetchAllContent(): Promise<UnknownRecord | null> {
  if (!fullContentCachePromise) {
    fullContentCachePromise = (async () => {
      try {
        const payload = await fetchJson(CONTENT_API_ENDPOINT);
        return unwrapContentPayload(payload);
      } catch {
        return null;
      }
    })();
  }

  return fullContentCachePromise;
}

export async function fetchContentSection<T extends UnknownRecord>(
  sectionKey: string,
): Promise<T | null> {
  try {
    const sectionUrl = new URL(CONTENT_API_ENDPOINT);
    sectionUrl.searchParams.set("section", sectionKey);

    const payload = await fetchJson(sectionUrl.toString());
    const normalized = unwrapContentPayload(payload);

    if (normalized && isRecord(normalized[sectionKey])) {
      return normalized[sectionKey] as T;
    }

    if (normalized) {
      return normalized as T;
    }
  } catch {
    // Fall back to full payload lookup below.
  }

  const fullContent = await fetchAllContent();
  const sectionData = fullContent?.[sectionKey];

  return isRecord(sectionData) ? (sectionData as T) : null;
}
