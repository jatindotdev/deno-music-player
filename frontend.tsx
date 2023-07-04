/** @jsx h  */
import { h } from "https://deno.land/x/htm@0.1.3/mod.ts";

export function content() {
  return (
    <body class="text-[#e8e6e3] bg-[#181a1b] flex flex-col gap-8 justify-center items-center h-screen font-[Avenir] px-8 select-none">
      <span class="text-2xl fw-500">Music Player</span>
      <img
        id="album-img"
        class="rounded-lg mb-4"
        style={{ width: "auto", height: "300px", objectFit: "cover" }}
        src="/assets/banner.webp"
        alt="Album Image"
        preload="true"
      />
      <h1
        id="song-name"
        class="text-2xl fw100 w-[550px] max-w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
        Search your favourite song
      </h1>
      <audio controls tabIndex={-1} />
      <div class="flex w-[400px] max-w-full justify-center border-1 border-rounded-lg border-gray-600">
        <input
          id="input"
          class="bg-transparent transition pl-3 py-2 w-400px text-lg w-full"
          type="text"
          placeholder="Press / to focus"
        />
        <button
          id="search"
          class="px-4 py-2 border-l-1 border-rounded-lg border-gray-600 bg-gray-200 bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
          </svg>
        </button>
      </div>
      <div class="flex gap-2 items-center justify-center">
        <img class="h-5 w-5" src="assets/logo.svg" alt="" /> Deno Deploy
      </div>
    </body>
  );
}
