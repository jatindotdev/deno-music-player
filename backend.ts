import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as ytdl from "https://deno.land/x/ytdl_core@v0.1.1/mod.ts";
import YouTube from "https://deno.land/x/youtube_sr@v4.3.4-deno/mod.ts";
import html from "https://deno.land/x/htm@0.1.3/mod.ts";
import UnoCSS from "https://deno.land/x/htm@0.1.3/plugins/unocss.ts";
import { content } from "./frontend.tsx";

html.use(UnoCSS());

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = (
    await html({
      lang: "en",
      title: "Music Player",
      links: [
        {
          rel: "shortcut icon",
          href: "assets/logo.svg",
        },
      ],
      styles: [`* { outline: none; }`],
      scripts: [
        {
          src: "assets/script.js",
          defer: true,
        },
      ],
      body: content(),
    })
  ).body;
});

router.get("/audio", async (ctx) => {
  try {
    const query = ctx.request.url.searchParams.get("query");
    if (!query) {
      throw {
        status: 400,
        message: "query not provided",
      };
    }
    const searchData = await YouTube.searchOne(query);
    const { videoDetails, formats } = await ytdl.getInfo(
      searchData.url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    const audioFormat = ytdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    ctx.response.body = {
      title: videoDetails.title,
      albumArt: videoDetails.thumbnails[videoDetails.thumbnails.length - 1],
      videoURL: videoDetails.video_url,
      url: audioFormat.url,
    };
  } catch (e) {
    ctx.response.status = e.status ?? 500;
    ctx.response.body = {
      success: false,
      message: e.message ?? "Internal Server Error",
    };
  }
});

router.get("/play", async (ctx) => {
  try {
    const query = ctx.request.url.searchParams.get("query");
    if (!query) {
      throw {
        status: 400,
        message: "query not provided",
      };
    }
    const info = await ytdl.getInfo(query);

    const audio = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    ctx.response.body = await fetch(audio.url).then((res) => res.body);
  } catch (e) {
    ctx.response.status = e.status ?? 500;
    ctx.response.body = {
      success: false,
      message: e.message ?? "Internal Server Error",
    };
  }
});

router.get("/search", async (ctx) => {
  try {
    const query = ctx.request.url.searchParams.get("query");
    if (!query) {
      throw {
        status: 400,
        message: "query not provided",
      };
    }
    const searchData = await YouTube.search(query, { type: "video" });
    ctx.response.body = searchData;
  } catch (e) {
    ctx.response.status = e.status ?? 500;
    ctx.response.body = {
      success: false,
      message: e.message ?? "Internal Server Error",
    };
  }
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context) => {
  const pathname = context.request.url.pathname;
  if (pathname.startsWith("/assets")) {
    await send(context, pathname, { root: Deno.cwd() });
  }
});

app.addEventListener("listen", (e) =>
  console.log(`Listening on http://localhost:${e.port}`)
);

await app.listen({ port: 8000 });
