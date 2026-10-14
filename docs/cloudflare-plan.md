# MTK SH Cloudflare公開の引き継ぎ

更新日 2026年10月14日

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

languageは `ja`、`en`、`zh-Hans`。slugは `threeaims`、`dayslice`、`v-type`。ルート `/` は現在、日本語一覧を表示し、canonicalを `/ja/` に向けている。英語SEOを主経路とする正式公開時には、ルートの言語とx-defaultの方針を最終決定する。

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
