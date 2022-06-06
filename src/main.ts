import http from "node:http";

const port = 8000;

function main(): void {
  const server = http.createServer();

  server.on("request", (req, res) => {
    console.log(req.url);
    res.writeHead(200);
    res.end("Hello World!");
  });

  server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });
}

main();
