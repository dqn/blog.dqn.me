import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const port = 8000;

function withBaseDir(p: string): string {
  return path.join("docs", p);
}

function main(): void {
  const server = http.createServer();

  server.on("request", (req, res) => {
    console.log(req.url);

    if (req.url === undefined) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    const hasExt = path.extname(req.url) !== "";

    const filepath =
      (req.url === "/" ? withBaseDir("index") : withBaseDir(req.url)) +
      (hasExt ? "" : ".html");

    readFile(filepath, "utf8")
      .then((data) => {
        res.writeHead(200);
        res.end(data);
      })
      .catch((err) => {
        console.error(err);
        res.writeHead(404);
        res.end("Not Found");
      });
  });

  server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });
}

main();
