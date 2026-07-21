from __future__ import annotations

from collections import deque
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np


def rgb_to_hsv_np(rgb: np.ndarray) -> np.ndarray:
    rgb = rgb.astype(np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    cmax = np.max(rgb, axis=-1)
    cmin = np.min(rgb, axis=-1)
    delta = cmax - cmin

    s = np.zeros_like(cmax)
    nonzero = cmax > 0
    s[nonzero] = delta[nonzero] / cmax[nonzero]

    v = cmax
    h = np.zeros_like(cmax)
    return np.stack([h, s, v], axis=-1)


def largest_component_touching_bottom(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    best_pixels: list[tuple[int, int]] = []
    best_area = -1
    best_bottom_touch = False
    bottom_band = int(h * 0.1)

    for y in range(h):
        for x in range(w):
            if not mask[y, x] or visited[y, x]:
                continue

            q: deque[tuple[int, int]] = deque([(y, x)])
            visited[y, x] = True
            pixels: list[tuple[int, int]] = []
            touches_bottom = False

            while q:
                cy, cx = q.popleft()
                pixels.append((cy, cx))
                if cy >= h - bottom_band:
                    touches_bottom = True

                for ny, nx in (
                    (cy - 1, cx),
                    (cy + 1, cx),
                    (cy, cx - 1),
                    (cy, cx + 1),
                    (cy - 1, cx - 1),
                    (cy - 1, cx + 1),
                    (cy + 1, cx - 1),
                    (cy + 1, cx + 1),
                ):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        q.append((ny, nx))

            area = len(pixels)
            if area < int(h * w * 0.004):
                continue

            if touches_bottom:
                if (not best_bottom_touch) or area > best_area:
                    best_pixels = pixels
                    best_area = area
                    best_bottom_touch = True
            elif (not best_bottom_touch) and area > best_area:
                best_pixels = pixels
                best_area = area

    out = np.zeros_like(mask, dtype=np.uint8)
    for y, x in best_pixels:
        out[y, x] = 255
    return out


def extract_person(panel: Image.Image) -> Image.Image:
    arr = np.array(panel.convert("RGB"))
    h, w = arr.shape[:2]

    hsv = rgb_to_hsv_np(arr)
    sat = hsv[..., 1]
    val = hsv[..., 2]

    bg_white = (val > 0.90) & (sat < 0.18)
    bg_light_gray = (val > 0.82) & (sat < 0.08)
    bg = bg_white | bg_light_gray
    fg = ~bg

    # Reduce border noise before extracting the main body silhouette.
    fg[:, : int(w * 0.02)] = False
    fg[:, w - int(w * 0.02) :] = False

    mask = largest_component_touching_bottom(fg)
    alpha = Image.fromarray(mask, mode="L").filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))

    rgba = panel.convert("RGBA")
    rgba.putalpha(alpha)

    alpha_arr = np.array(alpha)
    ys, xs = np.where(alpha_arr > 10)
    if ys.size == 0 or xs.size == 0:
        return rgba

    y1, y2 = ys.min(), ys.max()
    x1, x2 = xs.min(), xs.max()
    pad_x = int(w * 0.03)
    pad_y = int(h * 0.03)

    box = (
        max(0, x1 - pad_x),
        max(0, y1 - pad_y),
        min(w, x2 + pad_x + 1),
        min(h, y2 + pad_y + 1),
    )
    return rgba.crop(box)


def main() -> None:
    base = Path(__file__).resolve().parent
    src_path = base / "nuevo.png"
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    step = w // 4

    for i in range(4):
        x1 = i * step
        x2 = (i + 1) * step if i < 3 else w
        panel = img.crop((x1, 0, x2, h))
        person = extract_person(panel)

        out_path = base / f"persona_{i + 1}_sin_fondo.png"
        person.save(out_path, format="PNG")
        print(f"Creado: {out_path.name}")


if __name__ == "__main__":
    main()
