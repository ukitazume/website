# AIエージェント向け対応

2026年10月19日追加。

- `/llms.txt`：英語の公式アプリ索引。`/llms-full.txt`：機能・FAQ・サポート・プライバシーを含む詳細版。
- `/ja/`・`/en/`・`/zh-Hans/` にもそれぞれ `llms.txt` と `llms-full.txt` を生成。
- `/assets/app-catalog.json`：3言語のアプリ概要、公開状況、対応言語、公式ページへのリンク。
- `agent-support.mjs` が既存のアプリ情報から生成するため、更新時は通常どおり `SITE_ORIGIN=https://mtk.sh node build.mjs` を実行。
- 各ページのheadから、その言語のllms.txtへリンク。

## WebMCP

`webmcp.js` を各通常ページで読み込み、`document.modelContext.registerTool` がある場合にだけ登録する。未対応ブラウザーでも通常の操作を維持する。

- `search_apps`：全通常ページ。現在のサイト言語でアプリを検索し、公開状況・アプリ内言語・公式リンクを返す。
- `filter_apps`：トップページ。既存のカテゴリボタンを操作し、表示中のアプリを返す。
- `show_app_section`：アプリ詳細ページ。既存のタブを操作し、詳細・サポート・プライバシー本文を返す。

実行時の入力検証、登録エラーの分離、AbortSignalによる離脱時の登録解除とページ復帰時の再登録を実装。外部パッケージやポリフィル、別サーバーは不要。

## 検証

`python3 validate.py` で全HTMLと内部リンク、索引、カタログを検証。
WebMCP対応のCodexブラウザーで実際の登録・検索・カテゴリ切替・サポートタブの表示、および不正なカテゴリの拒否を確認済み。WebMCPは対応ブラウザー上でページを開いている間に利用できる。

参考仕様：
- https://llmstxt.org/
- https://developer.chrome.com/docs/ai/webmcp/imperative-api
