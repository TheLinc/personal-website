"use client";

// Open Room: the app window recreated in code (ported from openroom.dev) playing a scripted session,
// with the crew at their desks on top. A button opens the real product demo video.

import { useRef } from "react";
import OpenRoomProduct from "@/components/products/open-room/OpenRoomProduct";

export default function OpenRoomDemo() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    videoRef.current?.play().catch(() => {});
  };
  const close = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <div className="flex flex-col gap-5">
      <OpenRoomProduct />

      <button
        type="button"
        onClick={open}
        className="mx-auto flex items-center gap-2 rounded-full bg-[#1d1c1a] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
      >
        <span aria-hidden="true">▶</span> Watch the real demo
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && close()}
        onCancel={close}
        aria-label="Open Room product demo"
        className="m-auto w-[min(1100px,94vw)] rounded-2xl bg-black p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <video
          ref={videoRef}
          src="/assets/open-room-demo.mp4"
          poster="/assets/open-room-poster.jpg"
          controls
          playsInline
          preload="none"
          className="block aspect-video w-full"
        />
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#1d1c1a]"
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
