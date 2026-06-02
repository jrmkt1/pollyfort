import { createApp } from "../server/index";

export default async function handler(req: any, res: any) {
  const app = await createApp({ serveClient: false });
  return app(req, res);
}
