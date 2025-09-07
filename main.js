import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { stream } from "hono/streaming";

const app = new Hono();

app.use("*", serveStatic({ root: "./assets" }));

const basicPages = ["navigation", "colophon"];

app.get("/:page?", async (c, next) => {
	const slug = c.req.param("page");

	c.header("content-type", "text/html;charset=utf-8");
	return stream(c, async (stream) => {
		using template = await Deno.open(`./views/${basicPages.includes(slug) ? "page-no-js" : "page"}.html`, { read: true });
		using content = await Deno.open(`./content/${slug ?? "index"}.html`, { read: true });

		await stream.pipe(template.readable);
		await stream.pipe(content.readable);
	});
});

export default app;
