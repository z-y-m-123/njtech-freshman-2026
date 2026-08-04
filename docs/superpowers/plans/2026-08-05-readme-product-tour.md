# README Product Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public README campaign animation with an optimized, real-interface product tour.

**Architecture:** A local Pillow renderer combines four supplied screenshots into a 1440x810 navy product-tour GIF. The README references only the generated GIF and retains the live CloudBase link. The renderer and source screenshots remain outside the promotion repository.

**Tech Stack:** Python 3, Pillow, GitHub-flavored Markdown, Git.

---

### Task 1: Render the product-tour GIF

**Files:**
- Create: `C:\Users\16507\AppData\Local\Temp\render-njtech-product-tour.py`
- Create: `C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo\public\njtech-starting-point-product-tour.gif`
- Test: `C:\Users\16507\AppData\Local\Temp\verify-njtech-product-tour.py`

- [ ] **Step 1: Write and run the failing asset contract check**

```python
from pathlib import Path
from PIL import Image
asset = Path(r"C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo\public\njtech-starting-point-product-tour.gif")
assert asset.exists(), "product-tour GIF is missing"
with Image.open(asset) as image:
    assert image.size == (1440, 810)
    assert getattr(image, "n_frames", 1) >= 20
assert asset.stat().st_size <= 4 * 1024 * 1024
```

Run: `python C:\Users\16507\AppData\Local\Temp\verify-njtech-product-tour.py`

Expected: `AssertionError: product-tour GIF is missing`.

- [ ] **Step 2: Render four real-interface scenes**

Use Pillow to create a 1440x810 GIF from supplied screenshots. Each scene uses a navy background, a 1060x596 screenshot inside a thin white frame, a 300px text column, and 6-8 frames of restrained push-in/crossfade motion. Use these labels: `01 / WELCOME` + `你好，南工`, `02 / CAMPUS MAP` + `先把校园装进口袋`, `03 / OFFICIAL SERVICES` + `官方入口，一站查找`, `04 / GROWTH` + `从报到，到成长`. End with `南工起点站` and the live URL.

- [ ] **Step 3: Verify GIF and inspect representative frames**

Run: `python C:\Users\16507\AppData\Local\Temp\verify-njtech-product-tour.py`

Expected: exit code `0`.

Extract the first, map, and service frames to PNG and inspect that screenshots are crisp, text is not clipped, and controls are visible.

- [ ] **Step 4: Commit the GIF**

```text
git -C C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo add public/njtech-starting-point-product-tour.gif
git -C C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo commit -m "docs: add product tour animation"
```

### Task 2: Switch the README to the product tour

**Files:**
- Modify: `C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo\README.md`
- Test: `C:\Users\16507\AppData\Local\Temp\verify-readme-product-tour.ps1`

- [ ] **Step 1: Write and run the failing README contract check**

```powershell
$readme = Get-Content 'C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo\README.md' -Raw
if ($readme -notmatch 'njtech-starting-point-product-tour\.gif') { throw 'README does not use product-tour GIF' }
if ($readme -match 'njtech-starting-point-bubbles\.gif') { throw 'README still references retired bubble GIF' }
if ($readme -notmatch 'tcloudbaseapp\.com') { throw 'README does not retain live-site link' }
```

Run: `powershell -ExecutionPolicy Bypass -File C:\Users\16507\AppData\Local\Temp\verify-readme-product-tour.ps1`

Expected: `README does not use product-tour GIF`.

- [ ] **Step 2: Replace hero reference and lead copy**

Replace the existing campaign GIF URL with `public/njtech-starting-point-product-tour.gif?v=20260805-product-tour`. Set the opening copy to: `报到准备、校园探索、官方服务与成长信息，在一个清晰入口里完成。`

- [ ] **Step 3: Run README contract check and commit**

Run: `powershell -ExecutionPolicy Bypass -File C:\Users\16507\AppData\Local\Temp\verify-readme-product-tour.ps1`

Expected: exit code `0`.

```text
git -C C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo add README.md
git -C C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo commit -m "docs: feature live product experience"
```

### Task 3: Validate repository boundary and publish

**Files:**
- Verify: `C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo\README.md`
- Verify: `C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo\public\njtech-starting-point-product-tour.gif`

- [ ] **Step 1: Confirm public file list**

Run: `git -C C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo ls-files`

Expected: `README.md`, the product-tour GIF, and documentation only; no website source, CloudBase configuration, data, or deployment scripts.

- [ ] **Step 2: Re-run GIF contract and publish**

Run: `python C:\Users\16507\AppData\Local\Temp\verify-njtech-product-tour.py`

Expected: exit code `0` and GIF at or below `4 MB`.

```text
git -C C:\Users\16507\Documents\Codex\2026-07-19\njtech-freshman-promo push origin promo-main:main
```
