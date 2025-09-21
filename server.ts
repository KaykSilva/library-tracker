// server.ts
import express from "express";
import type { Request, Response } from "express";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev, dir: path.join(__dirname) });
const handle = app.getRequestHandler();

async function start() {
    try {
        await app.prepare();
        const server = express();

        // Example Express API route
        server.get("/api/hello", (req: Request, res: Response) => {
            res.json({ message: "Hello from Express API 🚀" });
        });

        server.use((req: Request, res: Response) => {
            return handle(req, res);
        });

        server.listen(port, () => {
            console.log(`> Ready on http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
}

start();
