# README Product Tour Design

## Goal

Replace the existing abstract campaign GIF with a concise product-tour GIF for the public GitHub README. The animation must promote the live Nanjing Tech Starting Point site through real interface screenshots while keeping the website source and deployment material private.

## Visual Direction

- Use a restrained deep navy shell and the product's existing blue UI as the visual system.
- Treat the real site UI as the hero content; no bubbles, illustrated characters, dense floating cards, or decorative infographic scenes.
- Keep one short Chinese headline per scene, with a small English section label only where it improves hierarchy.
- Use crisp full-resolution screenshots in one consistent browser-like frame. Avoid cropping important controls or text.
- Motion is limited to slow push-ins, crossfades, and a short title reveal. The GIF must remain readable when stopped on any frame.

## Narrative

1. **Welcome**: show the home screen with the Tianbao Tower photo and introduce `你好，南工`.
2. **Explore**: show the Jiangpu campus map to demonstrate interactive practical guidance, titled `先把校园装进口袋`.
3. **Navigate**: show the official service and growth-navigation screens, titled `从报到，到成长`.
4. **Close**: show the product URL and `南工起点站` on a quiet navy background.

## Assets

- Home screenshot: `codex-clipboard-2fa780f3-e60f-4e7f-8371-59e9d490c771.png`
- Map screenshot: `codex-clipboard-26ba7e32-c7cc-4ed7-bfc0-d9159918bf61.png`
- Official-service screenshot: `codex-clipboard-a036ddd3-094a-44cc-a8aa-710e7d11ff63.png`
- Growth screenshot: `codex-clipboard-7f3fc2d4-cf37-499d-a98e-50b009116c18.png`

The produced public asset is a single optimized GIF at `public/njtech-starting-point-product-tour.gif`. The input screenshots are not added to the public repository.

## README Changes

- Replace the current hero GIF link with the new product-tour GIF.
- Update the lead copy so the visual describes a practical navigation product rather than a conceptual campaign.
- Preserve the live CloudBase link and the existing privacy boundary: no source code, CloudBase configuration, datasets, or deployment scripts are published.

## Validation

- Inspect representative GIF frames at full size for text clipping, overlap, and source-image distortion.
- Ensure the optimized GIF is small enough for a GitHub README to load comfortably, targeting 4 MB or less.
- Confirm that only the README, product-tour GIF, and this design note are included in the public promotion worktree.
