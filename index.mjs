import {
  Application,
  Router,
  send,
} from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import * as ytdl from 'https://deno.land/x/ytdl_core@v0.1.1/mod.ts';
import YouTube from 'https://deno.land/x/youtube_sr@v4.3.4-deno/mod.ts';

const router = new Router();

router.get('/', async (ctx) => {
  await ctx.send({ root: 'dist/', index: 'index.html' });
});

router.get('/audio', async (ctx) => {
  const query = ctx.request.url.searchParams.get('query');
  if (!query) {
    ctx.response.status = 400;
    return (ctx.response.body = { message: 'query not provided' });
  }
  const searchData = await YouTube.searchOne(query);
  const { videoDetails, formats } = await ytdl.getInfo(searchData.url);
  const audioFormat = ytdl.chooseFormat(formats, {
    filter: 'audioonly',
    quality: 'highestaudio',
  });
  ctx.response.body = {
    title: videoDetails.title,
    albumArt: videoDetails.thumbnails[videoDetails.thumbnails.length - 1],
    videoURL: videoDetails.video_url,
    url: audioFormat.url,
  };
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context) => {
  if (context.request.url.pathname.startsWith('/assets')) {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/dist/`,
    });
  }
});

app.addEventListener('listen', (e) =>
  console.log(`Listening on http://localhost:${e.port}`)
);

await app.listen({ port: 8000 });
