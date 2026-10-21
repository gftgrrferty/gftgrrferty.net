# gftgrrferty.net

## 環境インストール

node.jsとnpmが必要です。

```bash
npm install
```

## ビルド

```bash
npm run build
```

`./_site/`にページがビルドされます。

## テスト

以下のコマンドでEleventyのローカルサーバーを起動します。

```bash
npx wrangler dev
```

## ファイル構成

- `./build_scripts/` - ビルド時に使うスクリプトがあるディレクトリ
- `./build_scripts/.eleventy.js` - ビルドスクリプトの始まり
- `./package.json` - npmの設定ファイル
- `./wrangler.jsonc` - [Cloudflare Workersの設定ファイル](https://developers.cloudflare.com/workers/wrangler/configuration/)
- `./public/` - 公開用のファイル, ほぼそのままコピーされる
  - `./public/.well-known/` - well-knownディレクトリ
  - `./public/assets/` - 画像などのアセット
  - `./public/_headers/` - [HTTPヘッダーの設定ファイル](https://developers.cloudflare.com/pages/configuration/headers/)
  - `./public/_redirects/` - [リダイレクトの設定ファイル](https://developers.cloudflare.com/pages/configuration/redirects/)
  - `./public/robots.txt` - [robots.txtファイル](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt?hl=ja)
- `./src/` - ソースコード
  - `./src/_data/` - データファイル
    - `./src/_data/site.json` - サイト名やアイコンなど
  - `./src/_includes/` - テンプレートファイル
    - `./src/_includes/article.njk` - ノート用のテンプレート, タイトルと日付が表示される
    - `./src/_includes/base.njk` - テンプレートのベース, headerとfooterを含む
    - `./src/_includes/default.njk` - 普通のページ用テンプレート, 空
    - `./src/_includes/head.njk` - headタグ内の内容
  - `./src/assets/` - SCSS用アセット、コンパイルしたCSSは`./_site/assets/`にコピーされる
  - `./src/notes/` - ノートのMarkdownファイル, YYYY-MM-DD-name.mdの形式で保存
  - `./src/pages/` - トップページなどをまとめておくディレクトリ
    - `./src/pages/404.md` - 404ページ
    - `./src/pages/home.md` - トップページ, ノートのリストもある
    - `./src/pages/sitemap.xml` - [サイトマップ](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#xml), ビルド時に全ページURLが自動で追加される
- `./_site/` - ビルドされたサイト(完成品)
