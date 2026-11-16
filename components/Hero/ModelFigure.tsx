import Image from "next/image";
import still from "@/public/model/model-still.jpg";

/** The terrain's data imagined as a physical object: closes the hero. AI-generated from a render of the real terrain. */
export default function ModelFigure({ total }: { total: number }) {
  return (
    <figure className="mx-auto max-w-7xl px-5 pt-20 md:px-10 md:pt-28">
      <div className="relative overflow-hidden border border-rule">
        <Image
          src={still}
          alt="AI-generated image of the contribution grid as a machined aluminium scale model: a long low plate rising to a cluster of tall orange columns."
          sizes="(min-width: 1280px) 1200px, 100vw"
          placeholder="blur"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="fig mt-3 flex flex-wrap justify-between gap-2">
        <span>
          Fig. 0 — {total.toLocaleString("en-US")} contributions · scale 1 column : 1 day
        </span>
        <span className="text-faint">AI-generated from a render of the live terrain</span>
      </figcaption>
    </figure>
  );
}
