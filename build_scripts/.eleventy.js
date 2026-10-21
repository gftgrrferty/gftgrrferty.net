import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IdAttributePlugin } from "@11ty/eleventy";

import { ensureDateFromFilename, firstItems, getCurrentYear, sortByDateAndFilenameDesc, toDT } from "./dates.js";
import { renameAssetsAndRewriteHtml } from "./assets.js";
import { cleanDir, findFiles } from "./files.js";
import { minifyHtml, minifyJs, minifyXml } from "./minify.js";
import { compileSass } from "./sass.js";
import { log } from "./log.js";

import projectOrder from "./projectOrder.js";

// -------- 設定用定数 --------

// タイムゾーン
const timezone = "Asia/Tokyo";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // ../

// ディレクトリの定数
const dirs = {
  input: "src",
  includes: "_includes",
  data: "_data",
  output: "_site",
  public: "public",
  assets: "assets",
};
const outRoot = path.join(root, dirs.output);

// キャッシュ可能とみなすファイルの拡張子
const assetExtensions = [
  ".css", ".js",
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".avif", ".bmp",
  ".tif", ".tiff",
];

// -------- Eleventyの設定 --------

export default function (eleventyConfig) {
  // ヘッダーにid属性を付与するプラグイン
  // eleventyConfig.addPlugin(IdAttributePlugin, {
  //   // Custom slugify for Japanese
  //   slugify: (text) => text.trim().toLowerCase()
  //     .replace(/[^\p{L}\p{N}_-]+/gu, "-")
  //     .replace(/^-+|-+$/g, ""),
  // });

  // フィルター
  eleventyConfig.addFilter("date", (value) => toDT(value, timezone).toFormat("yyyy年 M月 d日"));
  eleventyConfig.addFilter("dateISO", (value) => toDT(value, timezone).toFormat("yyyy-MM-dd"));
  eleventyConfig.addFilter("firstItems", firstItems);
  eleventyConfig.addShortcode("currentYear", () => getCurrentYear(timezone));

  // --- コレクション ---

  eleventyConfig.addCollection("notes", (api) => {
    // ./src/notes/にあるMarkdownファイルを取得
    const items = api.getFilteredByGlob("./src/notes/**/*.md");
    items.forEach(ensureDateFromFilename);

    // hidden: trueを除外
    const visible = items.filter((item) => !item.data.hidden);
    // 日付の降順とファイル名の降順で並び替え
    const sorted = visible.sort(sortByDateAndFilenameDesc);

    return sorted;
  });

  // ./public/の内容をそのままコピー
  eleventyConfig.addPassthroughCopy({ [dirs.public]: "/" });

  // ビルド前の処理
  eleventyConfig.on("beforeBuild", () => {
    cleanDir(outRoot);
    // Sassのコンパイル
    compileSass(path.join(root, dirs.input, dirs.assets), path.join(outRoot, dirs.assets));
  });

  // HTMLのminify
  // eleventyConfig.addTransform("minify-output", async (content, outputPath) => {
  //   if (!outputPath) return content;
  //   try {
  //     if (outputPath.endsWith(".html")) {
  //       log(`Minifying HTML ${path.relative(outRoot, outputPath)}`);
  //       return await minifyHtml(content);
  //     }
  //   } catch (error) {
  //     console.warn(`Minify failed for ${outputPath}: ${error.message}`);
  //   }
  //   return content;
  // });

  // ビルド後の処理
  eleventyConfig.on("afterBuild", async () => {
    // JSとXMLのminify
    // for (const filePath of findFiles(outRoot, (filePath) => /\.(js|xml)$/.test(filePath))) {
    //   if (filePath.endsWith(".js")) {
    //     log(`Minifying JS ${path.relative(outRoot, filePath)}`);
    //     fs.writeFileSync(filePath, await minifyJs(fs.readFileSync(filePath, "utf8")));
    //   } else {
    //     log(`Minifying XML ${path.relative(outRoot, filePath)}`);
    //     fs.writeFileSync(filePath, minifyXml(fs.readFileSync(filePath, "utf8")));
    //   }
    // }

    // キャッシュ可能な/assets/にあるファイルの名前にハッシュを追加する
    // await renameAssetsAndRewriteHtml({
    //   outRoot,
    //   assetsSubdir: dirs.assets,
    //   includeExts: assetExtensions,
    // });
  });

  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: dirs.input,
      includes: dirs.includes,
      data: dirs.data,
      output: dirs.output,
    },
  };
}
