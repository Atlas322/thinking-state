import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "src/catalog.json"), "utf8"),
);
const entries = [];
const add = (name, contents) =>
  entries.push({
    name: `component-library/${name}`,
    contents: Buffer.from(contents),
  });
const files = fs
  .readdirSync(path.join(root, "src/library"))
  .filter((name) => name.endsWith(".tsx"))
  .sort();
for (const file of files)
  add(
    `components/${file}`,
    fs.readFileSync(path.join(root, "src/library", file)),
  );
for (const entry of catalog) {
  const variants =
    !entry.pro || entry.slug === "thinking-state" ? ["", "-classic"] : [""];
  for (const suffix of variants)
    add(
      `examples/${entry.slug}${suffix}.tsx`,
      entry.usage.replaceAll(
        `./${entry.slug}"`,
        `../components/${entry.slug}${suffix}"`,
      ),
    );
}
add("catalog.json", JSON.stringify(catalog, null, 2));
add("LICENSE.affectui", fs.readFileSync(path.join(root, "LICENSE.affectui")));
add(
  "LICENSE.simple-icons",
  fs.readFileSync(path.join(root, "LICENSE.simple-icons")),
);
add(
  "COMPONENT_REVIEW.md",
  fs.readFileSync(path.join(root, "COMPONENT_REVIEW.md")),
);
for (const file of [
  "ARCHITECTURE_AUDIT.md",
  "VISUAL_REVIEW.md",
  "MIT_SOURCE_VERIFICATION.json",
  "REFERENCE_API_AUDIT.csv",
  "review/AGENT_GRAPH.md",
  "review/agent-graph-reference.png",
  "review/agent-graph-before.png",
]) add(file, fs.readFileSync(path.join(root, file)));
add(
  "THIRD_PARTY_NOTICES.md",
  fs.readFileSync(path.join(root, "THIRD_PARTY_NOTICES.md")),
);
add(
  "README.md",
  `# Thinking State — copyable library\n\n90 components, 114 standalone TSX files, with matching usage examples.\n\n1. Copy the selected file from components/ into your React 19 + TypeScript project.\n2. Follow the corresponding example in examples/. Adjust the import path.\n3. Styles are embedded. No Tailwind, icon or animation library is needed.\n4. Add className="dark" or data-theme="dark" to an ancestor for dark mode.\n5. The default export is a preview; the named export accepts real application data.\n6. Connect callbacks to your own application. These previews do not perform backend actions.\n\n23 components are original MIT-licensed affectUI code, with Clean and Classic variants. Keep their license notices when copying. 67 are independent recreations of publicly visible behaviors; their appearance and APIs can differ, and they are not the paid affectUI source.\n\nThe private repository is not required to use these files. Give your coding assistant the full TSX file and its example.\n`,
);

// ZIP with raw DEFLATE, UTF-8 filenames, deterministic timestamps, and CRC-32.
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}
const bodies = [],
  central = [];
let offset = 0;
for (const entry of entries) {
  const name = Buffer.from(entry.name),
    compressed = zlib.deflateRawSync(entry.contents),
    crc = crc32(entry.contents);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x800, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt16LE(33, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(compressed.length, 18);
  header.writeUInt32LE(entry.contents.length, 22);
  header.writeUInt16LE(name.length, 26);
  bodies.push(header, name, compressed);
  const record = Buffer.alloc(46);
  record.writeUInt32LE(0x02014b50, 0);
  record.writeUInt16LE(20, 4);
  header.copy(record, 6, 4, 30);
  record.writeUInt32LE(offset, 42);
  central.push(record, name);
  offset += header.length + name.length + compressed.length;
}
const directory = Buffer.concat(central),
  end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
fs.mkdirSync(path.join(root, "public"), { recursive: true });
const archive = Buffer.concat([...bodies, directory, end]);
fs.writeFileSync(path.join(root, "public/component-library.zip"), archive);
console.log(
  `Packaged ${catalog.length} components, ${files.length} source files, ${entries.length} archive entries (${Math.round(archive.length / 1024)} KB).`,
);
