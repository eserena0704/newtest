export type ApiRequest = {
  method?: string;
  body?: string | unknown;
  headers?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (payload: unknown) => unknown;
  };
};

export const parseJsonBody = (body: string | unknown) => {
  if (typeof body === "string") {
    return JSON.parse(body || "{}");
  }

  return body || {};
};

export const getHeader = (req: ApiRequest, name: string) => {
  const value = req.headers?.[name] || req.headers?.[name.toLowerCase()];

  return Array.isArray(value) ? value[0] : value;
};
