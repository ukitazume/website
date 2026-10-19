# MTK SH Cloudflare公開の引き継ぎ

更新日 2026年10月19日

## 現在の公開状態

2026年10月14日、Cloudflare Pagesへ公開し、`https://mtk.sh` を本番ドメインに設定した。Sitesの本人限定プレビューは確認用として残す。トップ・アプリ詳細・カスタム404はHTTPSで応答し、全ページのcanonicalとSNSメタデータは `mtk.sh` を参照する。

| 設定 | 現在値 |
| --- | --- |
| Pagesプロジェクト | `mtk-sh` |
| Pages URL | `https://mtk-sh.pages.dev` |
| カスタムドメイン | `https://mtk.sh` |
| DNS | `mtk.sh` のプロキシ済みCNAME → `mtk-sh.pages.dev` |
| ビルド | `SITE_ORIGIN=https://mtk.sh node build.mjs` |
| 配信 | `npx wrangler pages deploy dist --project-name=mtk-sh --branch main` |
| ソース | `https://github.com/ukitazume/website` の `main` ブランチ |

DNSの既存MX・TXT・Stripe確認レコードと他のサブドメインは維持している。ソースはGitHubの `main` にpush済み。現在のPagesプロジェクトはGit連携なしの直接アップロードで公開する。Cloudflare側のビルド設定にも `node build.mjs` と `dist` を登録したが、Git連携を設定するまでは上記Wranglerコマンドで配信する。

## 配信方式

このサイトはNode.jsでHTMLを事前生成する静的サイト。閲覧時のサーバー処理、データベース、Sites専用APIに依存しない。生成済みの `dist/` が配信対象となる。Cloudflare Pagesは静的HTMLを配信できるため、今回の構成をそのまま載せられる。[Cloudflare公式の静的HTMLガイド](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)

Cloudflare Pagesの設定は次のとおり。

| 設定 | 値 |
| --- | --- |
| プロジェクトルート | `app-collection/` |
| フレームワーク | なし |
| ビルドコマンド | `node build.mjs` |
| 公開ディレクトリ | `dist` |
| 環境変数 | `SITE_ORIGIN` に確定した公開元URLを設定 |

ビルドコマンド、公開ディレクトリ、環境変数はCloudflare側で設定する。[Cloudflareのビルド設定](https://developers.cloudflare.com/pages/configuration/build-configuration/)

`SITE_ORIGIN` を省略するとSitesプレビューURLを使用する。正式版を生成するときは `https://mtk.sh` を渡す。canonical、hreflang、Open Graph/Twitterカード、構造化データ、サイトマップに同じoriginを使う。

## ソースの管理

| ファイル | 役割 |
| --- | --- |
| `content.mjs` | アプリ情報、翻訳、公開元URLの設定 |
| `data/support-content.json` | サポートとプライバシーの本文・移行元 |
| `build.mjs` | 全ページとサイトマップの生成 |
| `dist/assets/` | 編集元を兼ねるCSS・JS・実画像 |
| `validate.py` | 内部リンク・画像・メタデータの確認 |
| `docs/` | デザイン方針、画像プロンプト、公開手順 |
| `.openai/hosting.json` | Sitesプレビュー用の配信設定 |

現状、CSS・JS・画像は `dist/assets/` 自体を編集元として追跡している。`dist/` を削除してからビルドしないこと。Cloudflareには `dist/` だけを配信し、設計書やソースを配信対象に含めない。

## URLの構成

```text
/{language}/
/{language}/apps/{slug}/
/{language}/support/
/{language}/apps/{slug}/support/
/{language}/apps/{slug}/privacy/
```

languageは `ja`、`en`、`zh-Hans`。slugは `threeaims`、`dayslice`、`v-type`、`frames`、`wiws`。ルート `/` は現在、日本語一覧を表示し、canonicalを `/ja/` に向けている。英語SEOを主経路とする正式公開時には、ルートの言語とx-defaultの方針を最終決定する。

## Framesの掲載（2026年10月15日）

FramesはApp Store審査中として一覧・詳細・サポート・プライバシーに掲載。日英中の9ページを追加し、全44 HTMLページ・42サイトマップ項目となる。説明は審査提出版1.0の保存済み掲載情報、12言語とiOS 18の要件はアプリの実装を参照した。サポートとポリシーは既存の公開ページ `https://frames-support.u-kitazume.chatgpt.site/` を移行・翻訳している。旧サイトとApp Store Connectの設定は維持する。

`data/frames.mjs` の `releaseStatus: 'in-review'` が、ストアリンク、価格、公開バージョン、構造化データのダウンロード情報を抑制する。配信を確認したら `released` に変更し、同ファイルのFAQ・言語注記と `data/support-content.json` の配信状況も更新する。ストア価格・公開バージョンもその時点で確認する。

アイコンはFramesのAppIcon、3枚の画面は既存の開発版スクリーンショット（SWOT、重み付き比較、カスタマージャーニー）をPNGのまま使用。App Store掲載画像とは表記せず、日本語の開発版実画面であることを各言語で明記する。

`data/frames-catalog.json` は実装済みの `templates.json` と `explanations.json` から抽出した67種類・11用途の日英中カタログ。各フレームの説明、使いどころ、具体例を掲載し、検索と用途別の開閉に対応する。元ファイルのSHA-256をデータ内に記録している。更新時はアプリの実装済みIDとの一致を確認する。

`frames-catalog.mjs` が紹介とA4出力例を生成し、専用CSS・JSは `dist/assets/frames-catalog.*` に置く。ユーザー提供の「新しいジョハリの窓.pdf」は白紙ワークシートの実例として `dist/examples/frames-johari-a4.pdf` に無変更で複製。A4縦（210 × 297 mm）1ページ、日本語。プレビューPNGはmacOSのPDF描画で生成し、日本語と罫線を目視確認した。本文で白紙の出力例と明記し、原本を開く・ダウンロードする導線を設ける。

## WIWSの掲載（2026年10月15日）

WIWS（What I Wanted to Say）を審査中として追加。日英中の紹介・サポート・プライバシー9ページを追加し、サイト全体は53 HTMLページ・51サイトマップ項目。`data/wiws.mjs`に紹介とサポート本文を集約し、実装f5f183cと2026年10月13日の保存済みApp Store文面を参照している。アプリ内の表示・解説は日本語、学習対象は英語。サイト翻訳とは区別する。

`releaseStatus: 'in-review'`でダウンロードリンクと公開済みの構造化データを抑制。公開時に状態・価格・バージョン・FAQ・サポート本文を確認する。アイコンはアプリの実素材、紹介画像はApp Store向けに作成済みのビジュアルを使用し、実画面ではないことを明記。AI処理時の送信、任意のiCloud保存、運用集計、同意付き評価保存、購読確認の扱いを掲載した。App Store ConnectのURL設定は変更していない。

### WIWSの実画面

紹介画像に加えて、サンプル日記を使った開発版のスクリーンショット3枚を掲載。PNGは加工せずコピーし、各言語で説明と拡大リンクを付けた。画面とAI出力はUI確認用のサンプルであり、公開版や実際のクラウドAIの応答とは説明しない。

| 配信画像 | WhatIWantedToSay内の元画像 | 画面 |
| --- | --- | --- |
| `wiws-screen-write.png` | `docs/qa/back-to-write/after-step1-after-back.png` | 日本語で日記を書く |
| `wiws-screen-correction.png` | `output/annual-ink-127/after-light.png` | 添削と日本語の解説 |
| `wiws-screen-reflection.png` | `output/pr120/after-end.png` | 学習結果の振り返り |

## WIWSの公開版に合わせた紹介文の更新（2026年10月19日）

Linear Y2-123。App Store提出版に合わせて `data/wiws.mjs` の紹介・サポート・プライバシー本文を日英中で書き直した。参照元はアプリの `origin/main` `fb49c86`（docs/00・05・09・16・17、ADR-0007/0008、`FeatureFlags.swift`）。design-policy.md のとおり抽象的な効果の文言は使わず、できることだけを書く。

- 本番ビルドで既定onの機能だけを掲載する: 5ステップ（日本語で書く → 書き起こし案2つ、または日記をそのまま → 自分で英作文 → 修正箇所・日本語解説・CEFR目安の添削 → 最大3枚のフレーズカード）、iOS標準の読み上げ（端末内）、土曜日の週次振り返り、週1枚の「誰かの日記」、4種類のウィジェット、四季のインク、リマインダー、Face ID／Touch IDロック、iCloud Drive。
- 掲載しないもの（フラグが既定off、または本番で無効）: Standard ¥300/月（`standardPlan`）、Pro年額 ¥5,800（`proYearlyOffer`）、Free（完全ローカル）（`localFree`）、ElevenLabs音声（本番の既定off。ホームの「聴く」ボタンも出ない）、👎フィードバックの送信（`feedbackUpload`）。アプリ側でこれらを有効にしたら、`data/wiws.mjs` の該当箇所（features・faq・price・support・privacy）を同時に更新する。
- プランの表記: 無料体験は最初の日記から4日間・1日1本・自動課金なし。Pro ¥680/月（1日1本）、Max ¥1,980/月（1日5本）。税込。
- プライバシーの表記: 添削・単語ヒント・フレーズは整えた日本語と英文を中継サーバー経由で送る。原文を使う質問・書き起こし・週次振り返りは「日記の原文をAIに送信する」（既定オフ）をオンにしたときだけクラウドへ。Apple Intelligenceが使えない端末では常に送信し、アプリが表示する。👍／👎は端末内のみ。
- 前回コミット（2bbad8f）の `dist/` は `SITE_ORIGIN` なしでビルドされ、canonical・OG画像がSitesプレビューURLになっていた（`validate.py` が落ちる状態）。今回 `SITE_ORIGIN=https://mtk.sh` で再生成した。`dist/` をコミットする前は必ず `SITE_ORIGIN=https://mtk.sh node build.mjs && python3 validate.py` を通す。
- `releaseStatus: 'in-review'` のまま。確認日 `checked` は `2026-10-19`。

### プレビューと本番反映の手順

1. ブランチ `wiws-release-copy` のPRをレビューする。Before／Afterのスクリーンショット（`/ja/apps/wiws/`・`/en/apps/wiws/`、390px・1280px）はPRに添付。
2. プレビュー配信（本番には出ない）: `npx wrangler pages deploy dist --project-name=mtk-sh --branch preview`。URLは `https://preview.mtk-sh.pages.dev` と、デプロイごとのハッシュ付きURL。
3. 本番反映: PRをmainにマージし、`SITE_ORIGIN=https://mtk.sh node build.mjs && python3 validate.py` のあと `npx wrangler pages deploy dist --project-name=mtk-sh --branch main`。`mtk.sh` は `main` の最新デプロイを配信する。

### App Store承認後に行うこと

1. App Storeのページ（`https://apps.apple.com/jp/app/wiws/id6820287706`）が開けることを確認する。
2. `data/wiws.mjs` の `releaseStatus:'in-review'` を `releaseStatus:'released'` に変える（1行）。これでダウンロードリンク、無料表示、公開バージョン、構造化データの `downloadUrl`／`offers` が有効になり、審査中の表示が消える。
3. 同じファイルで次を確認・更新する: `checked` の日付、FAQ「いつダウンロードできますか？」（削除または公開済みの文に）、`price` と FAQ「無料で使えますか？」の価格（App Store Connectの実価格と一致させる。年額やStandardを出すならここも）、`wiwsSupport` の各言語の「App Store審査中です」の節とプライバシーの「審査中」の文、ElevenLabsを本番で有効にしていれば音声の節。
4. `build.mjs` の `facts` は公開後 `'1.0'` を公開バージョンとして表示する。別のバージョンで公開した場合はここも直す。
5. `SITE_ORIGIN=https://mtk.sh node build.mjs && python3 validate.py` → コミット → `--branch main` で配信。App Store Connect のサポートURL・プライバシーポリシーURLを `https://mtk.sh/ja/apps/wiws/support/`・`https://mtk.sh/ja/apps/wiws/privacy/` に向ける。

## 公開後に残っている作業

1. 旧サポートサイトから新しい本番URLへ転送する。旧URLの `#privacy` や `#privacy-en` からも適切な言語のポリシーへ到達できるようにする。
2. App Store ConnectのサポートURL、マーケティングURL、プライバシーポリシーURLを、新しい一般公開URLへ変更する。アプリの審査・バージョン状態を確認してから更新する。
3. Search ConsoleのURLプレフィックスプロパティ `https://mtk.sh/` はHTMLタグで所有権を確認し、`https://mtk.sh/sitemap.xml` を送信済み。ドメインプロパティ `mtk.sh` はDNS確認待ち。計測を追加する場合は、既存の「独自の解析スクリプトを設置していない」という案内との整合も更新する。

## 移行対象

| アプリ | 現在のサポートサイト |
| --- | --- |
| ThreeAims | `threeaims-support.u-kitazume.chatgpt.site` |
| DaySlice | `dayslice-support.u-kitazume.chatgpt.site` |
| V-Type | `vtype-game.u-kitazume.chatgpt.site` |

新しい本番サイトが使えるまでは旧サイトを維持する。本人限定のSites URLをApp StoreのサポートURLに登録しない。問い合わせ先は引き続き `support@mtk.sh` を使う。

## リリース前確認

- [x] 本番ドメインを `mtk.sh` に確定した
- [x] 全言語のページ、内部リンク、404、HTTPSを確認した
- [x] canonical、hreflang、Open Graph/Twitterカード、favicon、Apple touch iconを確認した
- [ ] 390px幅とデスクトップ幅で横はみ出しがない
- [ ] 各アプリの公開バージョンと対応言語を再確認した
- [ ] ポリシーの内容とデータ処理が一致している
- [x] ログイン不要でサポートとポリシーを読める
- [ ] 旧URLから新URLへ移行できる
- [x] canonicalとサイトマップにプレビューURLが残っていない
