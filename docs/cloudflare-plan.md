# MTK SH Cloudflare公開の引き継ぎ

更新日 2026年10月14日

現在はSitesで本人限定プレビューを運用する。正式公開はCloudflareを予定しており、独自ドメイン・DNS・App Store Connectの登録URL・旧サポートサイトの転送は、正式公開時に切り替える。

## 配信方式

このサイトはNode.jsでHTMLを事前生成する静的サイト。閲覧時のサーバー処理、データベース、Sites専用APIに依存しない。生成済みの `dist/` が配信対象となる。Cloudflare Pagesは静的HTMLを配信できるため、今回の構成をそのまま載せられる。[Cloudflare公式の静的HTMLガイド](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)

Cloudflare Pagesを使う場合の設定案は次のとおり。まだCloudflareへのデプロイは行っていない。

| 設定 | 値 |
| --- | --- |
| プロジェクトルート | `app-collection/`。このフォルダを単独リポジトリにした場合はルート |
| フレームワーク | なし |
| ビルドコマンド | `node build.mjs` |
| 公開ディレクトリ | `dist` |
| 環境変数 | `SITE_ORIGIN` に確定した公開元URLを設定 |

ビルドコマンド、公開ディレクトリ、環境変数はCloudflare側で設定する。[Cloudflareのビルド設定](https://developers.cloudflare.com/pages/configuration/build-configuration/)

`SITE_ORIGIN` を省略すると現在のSites URLを使用する。指定する場合は `https://example.com` のようなoriginだけを渡し、パス、クエリ、認証情報を含めない。canonical、hreflang、OG URL、構造化データ、サイトマップに同じoriginを使う。

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

## 公開の順序

1. 本番ドメインとCloudflareの配信方式を確定し、ソースを本番用リポジトリへ配置する。
2. `SITE_ORIGIN` を設定して生成し、トップ・詳細・サポート・ポリシーが直接URLで開けることを確認する。
3. Cloudflareで独自ドメインを関連付け、DNSとHTTPSを確認する。Pagesでは管理画面のCustom domainsから関連付ける。[Cloudflareの独自ドメイン設定](https://developers.cloudflare.com/pages/configuration/custom-domains/)
4. ログイン不要の状態で全言語のページ、メールリンク、App Storeリンク、404を確認する。robots・canonical・hreflang・サイトマップのホストを確認する。
5. 旧サポートサイトから新しい本番URLへ転送する。旧URLの `#privacy` や `#privacy-en` からも、適切な言語のポリシーへ到達できるようにする。
6. App Store ConnectのサポートURL、マーケティングURL、プライバシーポリシーURLを、新しい一般公開URLへ変更する。更新可否はアプリの審査・バージョン状態を確認する。
7. Search Consoleの所有権確認とサイトマップ登録を行う。計測を追加する場合は、既存の「独自の解析スクリプトを設置していない」という案内との整合も更新する。

## 移行対象

| アプリ | 現在のサポートサイト |
| --- | --- |
| ThreeAims | `threeaims-support.u-kitazume.chatgpt.site` |
| DaySlice | `dayslice-support.u-kitazume.chatgpt.site` |
| V-Type | `vtype-game.u-kitazume.chatgpt.site` |

新しい本番サイトが使えるまでは旧サイトを維持する。本人限定のSites URLをApp StoreのサポートURLに登録しない。問い合わせ先は引き続き `support@mtk.sh` を使う。

## リリース前確認

- [ ] 本番ドメインを確定した
- [ ] 全ページの表示と内部リンクを確認した
- [ ] 390px幅とデスクトップ幅で横はみ出しがない
- [ ] 各アプリの公開バージョンと対応言語を再確認した
- [ ] ポリシーの内容とデータ処理が一致している
- [ ] ログイン不要でサポートとポリシーを読める
- [ ] 旧URLから新URLへ移行できる
- [ ] canonicalとサイトマップにプレビューURLが残っていない
