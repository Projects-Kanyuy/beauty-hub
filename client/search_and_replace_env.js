/* eslint-disable no-console */
const fs = require("fs").promises;
const path = require("path");

const BUILD_DIR = path.join(__dirname, "build");
const ENV_EXAMPLE = path.join(__dirname, ".env.example");

async function getFiles(dir, exts = new Set(["js", "html", "css"]), files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await getFiles(full, exts, files);
    } else {
      const ext = entry.name.split(".").pop();
      if (exts.has(ext)) files.push(full);
    }
  }
  return files;
}

function parseEnvExample(raw) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=")[0]);
}

async function main() {
  console.log("🔍 Replacing placeholders in build files...");

  let envRaw;
  try {
    envRaw = await fs.readFile(ENV_EXAMPLE, "utf8");
  } catch (err) {
    console.error(`❌ Could not read ${ENV_EXAMPLE}:`, err);
    process.exit(1);
  }

  const keys = parseEnvExample(envRaw);
  if (!keys.length) {
    console.log("⚠️ No keys found in .env.example");
    return;
  }

  const replacements = {};
  for (const key of keys) {
    const placeholder = `__ENV_${key}__`;
    const value = process.env[key];
    if (typeof value === "undefined") {
      console.warn(`⚠️ Missing value for ${key}, leaving placeholder as-is.`);
    } else {
      replacements[placeholder] = value;
    }
  }

  const files = await getFiles(BUILD_DIR);
  let changedCount = 0;

  for (const file of files) {
    let data = await fs.readFile(file, "utf8");
    let newData = data;
    for (const [placeholder, value] of Object.entries(replacements)) {
      newData = newData.replaceAll(placeholder, value);
    }
    if (newData !== data) {
      await fs.writeFile(file, newData, "utf8");
      console.log(`✅ Updated ${path.relative(BUILD_DIR, file)}`);
      changedCount++;
    }
  }

  console.log(`✨ Replacement complete. Modified ${changedCount} files.`);
}

main().catch((err) => {
  console.error("❌ Fatal error during env replacement:", err);
  process.exit(1);
});
