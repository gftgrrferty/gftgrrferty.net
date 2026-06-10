module.exports = function (eleventyConfig) {
  const path = require("node:path");
  const fs = require("node:fs");
  // .buildUtils.jsから便利な関数をインポート
  const {
    toDT,
    getCurrentYear,
    ensureDateFromFilename,
    sortByDateDesc,
    cleanDir,
    compileSass,
    firstItems,
    logTag,
  } = require("./.buildUtils");


  // -------- 設定用定数 --------

  // タイムゾーン
  const TZ = "Asia/Tokyo";

  // ディレクトリの定数
  const DIRS = {
    input: "src", // ビルド対象のディレクトリ
    includes: "_includes", // 共通テンプレートのディレクトリ
    data: "_data", // データファイルのディレクトリ
    output: "_site", // ビルド後の出力ディレクトリ
    public: "public", // 静的ファイルのディレクトリ(コピーされる)
    assetsSubdir: "assets", // 静的ファイルのサブディレクトリ(コピーされる)
  };

  // Sassのエントリーポイントと出力先の対応表
  const ASSETS = [
    {
      scssEntry: path.join(__dirname, DIRS.public, DIRS.assetsSubdir, "styles.scss"),
      cssOut: path.join(__dirname, DIRS.output, DIRS.assetsSubdir, "styles.css"),
    },
  ]


  // -------- フィルター --------

  eleventyConfig.addFilter("date", (value) => {
    return toDT(value, TZ).toFormat("yyyy年 M月 d日");
  });

  eleventyConfig.addFilter("dateISO", (value) => {
    return toDT(value, TZ).toFormat("yyyy-MM-dd");
  });

  // 配列の最初のn個のアイテムを返すフィルター
  eleventyConfig.addFilter("firstItems", firstItems);


  // -------- ショートコード --------

  eleventyConfig.addShortcode("currentYear", () => getCurrentYear(TZ));


  // -------- コレクション --------

  eleventyConfig.addCollection("notes", (api) => {
    // notesコレクションのアイテムを取得
    const items = api.getFilteredByGlob("./src/notes/**/*.md");
    items.forEach(ensureDateFromFilename);

    // hidden: trueを除外
    const visible = items.filter((item) => !item.data.hidden);
    // 日付の降順でソート
    const sorted = visible.sort(sortByDateDesc);

    return sorted;
  });


  // -------- アセット --------

  // publicディレクトリの内容をそのまま出力ディレクトリにコピー
  eleventyConfig.addPassthroughCopy({ [DIRS.public]: "/" });
  // 監視対象に追加 (serveで変更を検知して再ビルドするため)
  eleventyConfig.addWatchTarget(DIRS.public);

  // Sassをコンパイルする関数
  function compileSassTask() {
    // Sassのエントリーポイントと出力先の対応表をループして、Sassをコンパイル
    ASSETS.forEach(({ scssEntry, cssOut }) => {
      compileSass(scssEntry, cssOut, {
        style: "compressed",
        sourceMap: false,
      });
      // 監視対象に追加
      eleventyConfig.addWatchTarget(scssEntry);
    });
  }

  // 出力ディレクトリのパス
  const outRoot = path.join(__dirname, DIRS.output);

  // ビルド前に出力ディレクトリをクリーンアップしてからSassをコンパイル
  eleventyConfig.on("beforeBuild", () => {
    cleanDir(outRoot);
    compileSassTask();
  });


  // -------- Eleventyの設定 --------

  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: DIRS.input,
      includes: DIRS.includes,
      data: DIRS.data,
      output: DIRS.output,
    },
  };
};
