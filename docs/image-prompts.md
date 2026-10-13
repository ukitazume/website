# MTK SH 画像の制作方針と生成プロンプト

更新日 2026年10月14日

現在の一覧画像は、App Storeに掲載された実際のアプリアイコンをCSSの背景・図形・影と組み合わせている。サイト制作時に画像生成ツールで新規生成したものではない。元のアプリアイコン自体の制作プロンプトは、このサイトの制作記録には含まれていない。

以下のプロンプトは、今後背景画像を追加する場合の制作指示として用意したもの。現在の画像を生成した履歴として扱わない。

## 実素材と現在の組み方

アセットは `dist/assets/` にある。各アプリの `*-icon.jpg` はApp Storeの実アイコン、`*-screen-1.jpg` 〜 `*-screen-3.jpg` はストアの実スクリーンショット。取得元の公開メタデータは `data/app-store-jp.json`、`app-store-us.json`、`app-store-cn.json` に保存している。

| アプリ | 背景と構図 |
| --- | --- |
| ThreeAims | クリーム色 `#e9e5d8`。淡い帯を約−28度で配置。実アイコンを幅43%、−8度で配置し、薄い影を加える |
| DaySlice | ラベンダー `#dbdef1`。細い楕円の軌道。実アイコンを幅40%、7度で配置し、角を丸める |
| V-Type | 深い青 `#142530`。淡い光線と円弧。実アイコンを幅61%で置き、周縁をマスクでなじませる |

カード上のアプリ名、番号、短いキャプション、矢印はHTML/CSSで重ねる。画像内に焼き込まない。アプリの実画面を生成画像で置き換えない。

## 生成時の共通仕様

背景だけを生成し、ロゴ・アイコン・文字は後から実素材で組む。制作画像は1600×1200px相当の4:3を基準とし、現在のカード比率へ中央で切り抜いても成立するようにする。主な形は中央60%に収め、外周20%は失われてもよい領域とする。

背景は静かな質感と少数の形で構成し、実アイコンが最も目立つ状態を保つ。書き出しはWebPを基本とし、1枚250KB程度を目安に画質と容量を調整する。

## ThreeAims 背景用プロンプト

```text
Create a restrained editorial background for a small independent iOS app called ThreeAims.
Generate the background only, with no app icon, no logo, and no text. Warm off-white and pale
stone colors, approximately #e9e5d8 and #f4f0e7. A single broad paper-like plane crosses
diagonally from lower left to upper right, with a subtle edge and a soft, natural shadow.
Tactile but very fine material texture, quiet daylight, precise geometry, understated
print-design sensibility. Keep the center calm and open so an existing square black-and-white
app icon can be composited there later. Landscape 4:3 composition, suitable for a centered
near-square crop. No typography, numbers, interface, device mockup, glossy plastic, neon,
watermark, or extra objects.
```

仕上げ時に `threeaims-icon.jpg` を重ねる。数字の3や元の写真を生成し直さない。

## DaySlice 背景用プロンプト

```text
Create a minimal editorial background for DaySlice, an iOS app that visualizes the passage of a
day. Generate the background only. A pale lavender field, approximately #dbdef1, with two or
three extremely fine elliptical orbital lines around an empty center. Slight tonal variation and
soft diffuse light, a calm sense of rotation and elapsed time, mathematical rather than
decorative. Keep the composition flat and spacious so the supplied app icon remains the main
subject when added later. Landscape 4:3 composition, with the essential orbit structure inside
the central 60 percent for a centered near-square crop. No text, numerals, clock hands, app
icon, invented interface, device mockup, planets, stars, people, bright gradients, or watermark.
```

仕上げ時に `dayslice-icon.jpg` を重ねる。実アイコンの宇宙飛行士や文字はそのまま使用する。

## V-Type 背景用プロンプト

```text
Create an atmospheric but restrained background for V-Type, a portrait science-fiction action
game. Generate the background only, leaving the center open for an existing game icon. Deep
blue-black space, approximately #142530, with one very faint cool-cyan diagonal beam and a thin,
oversized orbital arc near the lower right. Suggest scale and depth with sparse light and subtle
haze. Precise, dark, quiet, and cinematic without visual clutter. Landscape 4:3 composition,
suitable for a centered near-square crop. Do not invent gameplay, spacecraft, characters,
enemies, weapons, interface elements, logos, lettering, or screenshots. No neon grid, explosive
effects, lens-flare overload, watermark, or bright border.
```

仕上げ時に `v-type-icon.jpg` を重ねる。必要な艦隊・光線のディテールは実素材から見せる。

## 新しいアプリの背景用テンプレート

```text
Create an editorial background for [APP NAME], an independent app for [VERIFIED PURPOSE].
Background only. Use [TWO OR THREE COLORS] and one simple visual idea related to [VERIFIED
FUNCTION]. Match a quiet portfolio of independent software: controlled composition, tactile or
precise material treatment, ample open space, and restrained lighting. Leave the center clear
for the supplied real app icon. Landscape 4:3, essential content inside the central 60 percent,
safe for a centered near-square crop. No text, logos, invented app interface, unsupported
product features, device mockups, watermark, or decorative clutter.
```

## 納品時に残す記録

生成する場合は、使用モデル、実行日、入力画像、実際に送ったプロンプト、出力ファイル、採用したトリミング、圧縮後の容量を残す。差し替え後は3枚を並べ、コントラストと情報量の差が大きすぎないことを確認する。
