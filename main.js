import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { stream } from "hono/streaming";

// TODO: handle more than one chunk
class SkipTrailingLineFeedStream extends TransformStream {
	constructor() {
		super({
			async transform(chunk, controller) {
				chunk = await chunk;
				if (chunk === null) controller.terminate();
				else controller.enqueue(chunk.at(-1) === 0x0a ? chunk.slice(0, chunk.length - 1) : chunk);
			},
		});
	}
}

const app = new Hono();

app.use("*", serveStatic({ root: "./assets" }));

const basicPages = ["navigation", "colophon"];

app.get("/:page?", async (c, next) => {
	const slug = c.req.param("page");

	c.header("content-type", "text/html;charset=utf-8");
	return stream(c, async (stream) => {
		using template = await Deno.open(`./views/${basicPages.includes(slug) ? "page-no-js" : "page"}.html`, { read: true });
		using content = await Deno.open(`./content/${slug ?? "index"}.html`, { read: true });

		await stream.pipe(
			await template.readable.pipeThrough(new SkipTrailingLineFeedStream()),
		);
		await stream.pipe(content.readable);
	});
});

export default app;
