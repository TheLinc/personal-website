# Bust hero, lstack carousel and page reorder: design

## Why

Lincoln attaches this site to job applications. It should show an engineer who knows how to work with AI, not only the products he has built. The hero should be bold and eyecatching. The rest of the page should stay light, calm and readable for people who aren't technical.

## Decided with Lincoln

### Page order

1. Hero
2. How I ship with agents
3. Experience
4. Built this way
5. GitHub
6. Skills
7. Reviews
8. Hire Lincoln

### Hero

- **The bust:** a 3D stone bust of Lincoln, the only likeness on the site.
  - Style: smooth, warm ivory stone in the spirit of primesec.ai's statue.
  - No fine detail: no pupils, no skin lines under the eyes, no painted texture. The face is smoothed in code.
  - Depth comes from shading baked into the deep carving (hair, eye sockets, folds), not from texture.
  - Face kept slim to match him (the first marble version made his face too wide).
- **Sunglasses:** neon-yellow (#f4ff1f) shutter shades with five slats per lens, curved to the face. They're a separate 3D object from the bust and are left unaffected by the scene lighting so the neon stays bright.
- **Hover:** the bust turns gently to follow the mouse.
- **Scroll:** the bust starts turned toward the name and turns to face the visitor. Then the sunglasses slide down the nose and drop out of frame.
  - The motion is quick and snappy, with a smoothed scrub that catches up fast, like primesec.ai.
- **Placement:** the bust slightly overlaps the "n" in "Lincoln", and the name stays readable. The tagline and buttons sit in front of the bust.
- **Logos:** the hero logo chips become Opinion System, lstack and Cover Me.

### How I ship with agents

- A horizontal, swipeable carousel of 8 cards, not a tall list.
- Each card has a hand-drawn monoline SVG that draws itself in when the card scrolls into view, a number, a short title and one line of text.
- Navigation: arrows, a counter and dots.
- The 8 cards, as in the approved mockup:
  1. Agree first
  2. Split the work
  3. Test first
  4. Less code
  5. Fresh eyes
  6. Stay focused
  7. Show proof
  8. Learn once
- The header links to github.com/TheLinc/lstack.

### Built this way

- Cover Me and Open Room cards keep their stats, "How it's built" and "Hardest problems" sections.
- Each big demo moves behind a "See it run" button.

## Approaches considered for the bust

| Approach | Verdict |
|---|---|
| **Real-time 3D with three.js** | **Chosen.** A GLB bust made from an AI image, with procedurally built sunglasses. It's the only option that supports the hover effect Lincoln liked on primesec.ai, and it scales to any screen. |
| Video frames scrubbed by scroll | Dropped. It can't react to the mouse, and the marble version looked too heavy. |
| A plain `<video>` scrubbed through `currentTime` | Rejected. Seeking is jerky, and Safari has no common transparent video format. |

## Calls I made (Claude)

- **Model size:** the raw model is 5.9 MB. It will be compressed (Draco geometry and a resized WebP texture) to aim for 1.5 MB or less.
- **Loading:** three.js loads only after the page appears. A still image of the bust shows first and also serves as the fallback.
- **Reduced motion:** visitors who have animations turned off see the still image, with no hover or scroll animation.
- **Scroll mapping:** no pinning. The animation runs over the first ~520px of scrolling.
- **Phone placement:** on small screens the bust sits smaller in the top right, behind the text. There's no hover on phones, so it follows scroll only.
- **Build animation:** the hero still doesn't use the build animation; the agents start building from the next section.
- **Carousel:** native CSS scroll-snap with no carousel library. The line drawings stay inline SVG.

## Open

- What Lincoln built at Opinion System for the AI integrations, for the Experience entry. This needs a sentence or two from him.
