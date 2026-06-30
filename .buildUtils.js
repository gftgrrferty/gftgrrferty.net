"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { DateTime } = require("luxon");
const sass = require("sass");

// -------- ログ出力のヘルパー --------
const logTag = (name, message) => {
  let tag;
  if (process.stdout && process.stdout.isTTY) {
    tag = `\x1b[90m[${name}]\x1b[0m`;
  } else {
    tag = `[${name}]`;
  }
  console.log(`${tag} ${message}`);
};

// -------- フィルターのヘルパー --------

// 日付をDateTimeオブジェクトに変換する関数
const toDT = (value, tz) => {
  if (!value) {
    return DateTime.now().setZone(tz);
  }
  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: tz });
  }
  if (typeof value === "string") {
    return DateTime.fromISO(value, { zone: tz });
  }
  return DateTime.fromISO(String(value), { zone: tz });
};

// 今の年を取得する関数
const getCurrentYear = (tz) => DateTime.now().setZone(tz).toFormat("yyyy");

// ファイル名から日付を作成してitem.data.dateにセットする関数
const ensureDateFromFilename = (item) => {
  if (!item || !item.data) {
    return;
  }
  if (!item.data.date) {
    const match = item.inputPath && item.inputPath.match(/(\d{4}-\d{2}-\d{2})-/);
    if (match) {
      item.data.date = match[1];
    }
  }
};

// 日付で降順ソートする関数
const sortByDateDesc = (a, b) => {
  const ad = a.data?.date || a.date;
  const bd = b.data?.date || b.date;

  const dataComparison = new Date(bd) - new Date(ad);
  if (dataComparison !== 0) {
    return dataComparison;
  }

  const af = a.inputPath || a.file;
  const bf = b.inputPath || b.file;
  return bf.localeCompare(af);
};

// 配列の最初のn個のアイテムを返す関数
const firstItems = (arr, n) => {
  if (!Array.isArray(arr)) {
    return arr;
  }

  const count = Number(n);
  if (Number.isNaN(count)) {
    return arr;
  }

  if (count < 0) {
    return arr.slice(count);
  }

  return arr.slice(0, count);
};

// -------- ファイル操作のヘルパー --------

// 特定のディレクトリをクリーンアップする関数
const cleanDir = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: false });
      logTag("build", `cleaned: ${dirPath}`);
    }
  } catch (e) {
    console.warn("Failed to clean dir:", dirPath, e.message);
  }
};

// Sassをコンパイルする関数
const compileSass = (srcFile, outFile, { style = "expanded", sourceMap = false } = {}) => {
  if (!fs.existsSync(srcFile)) return;
  const outDir = path.dirname(outFile);
  const result = sass.compile(srcFile, { style, sourceMap });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, result.css);
  logTag("sass", `${path.relative(process.cwd(), srcFile)} -> ${path.relative(process.cwd(), outFile)}`);
};

module.exports = {
  // date
  toDT,
  getCurrentYear,
  ensureDateFromFilename,
  sortByDateDesc,
  // build
  cleanDir,
  compileSass,
  // filters
  firstItems,
  // logging
  logTag,
};
