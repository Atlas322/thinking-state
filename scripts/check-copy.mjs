import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const root = process.cwd();
fs.mkdirSync("work", { recursive: true });
const dir = fs.mkdtempSync(path.join(root, "work/copy-check-"));
try {
  const catalog = JSON.parse(fs.readFileSync("src/catalog.json", "utf8"));
  const files = [];
  for (const entry of catalog) {
    // Module entries (src/company) import their folder; tsc -b checks them.
    if (entry.module) continue;
    for (const suffix of !entry.pro || entry.slug === "thinking-state"
      ? ["", "-classic"]
      : [""]) {
      const name = `${entry.slug}${suffix}`;
      const source = path.join(dir, `${name}.tsx`),
        usage = path.join(dir, `${name}.usage.tsx`);
      fs.copyFileSync(`src/library/${name}.tsx`, source);
      fs.writeFileSync(
        usage,
        entry.usage.replaceAll(`./${entry.slug}"`, `./${name}"`),
      );
      files.push(source, usage);
    }
  }
  const config = ts.readConfigFile("tsconfig.app.json", ts.sys.readFile).config;
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, root);
  const diagnostics = ts.getPreEmitDiagnostics(
    ts.createProgram(files, options),
  );
  if (diagnostics.length) {
    console.error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: () => root,
        getNewLine: () => "\n",
      }),
    );
    process.exitCode = 1;
  } else
    console.log(
      `All ${files.length / 2} copied components and usage examples compile independently.`,
    );
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
