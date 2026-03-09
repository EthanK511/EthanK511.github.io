/* ============================================================
   projects.js — Edit this file to add, change, or remove projects
   ============================================================

   Each project is an object with these fields:

     title  (string, required) — Project name
     tag    (string, required) — Category label shown as a badge,
                                  e.g. "Web App", "Tool", "Game", "Coming Soon"
     desc   (string, required) — Short description paragraph
     links  (array,  optional) — Buttons shown on the card.
                                  Each link: { label, href, dim }
                                    label — button text
                                    href  — URL (use "path/" for a local folder)
                                    dim   — (optional) true = muted style
     ghost  (bool,   optional) — true = renders as a "coming soon" dashed card

   ============================================================ */

const PROJECTS = [

  {
    title: 'Climate Action Team',
    tag:   'Web App',
    desc:  'A collaborative platform for climate activists — explore, discover, and connect over all things environmental.',
    links: [
      { label: 'Live Site',    href: 'https://cat.cateam.me' },
      { label: 'Local Mirror', href: 'cat-website/', dim: true },
    ],
  },

  // ── Add more projects below this line ──────────────────────
  // Copy the block above, fill in your details, and save.

  {
    title: 'Next Project',
    tag:   'Coming Soon',
    desc:  'Something new is in the works. Check back soon.',
    ghost: true,
  },

  {
    title: 'In Progress',
    tag:   'Coming Soon',
    desc:  'Another project currently being crafted.',
    ghost: true,
  },

];
