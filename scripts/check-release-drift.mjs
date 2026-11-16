// Warns when work sits on top of a published version (2026-11-17, screens.8):
//   npm run check:release-drift            warn only (exit 0)
//   npm run check:release-drift -- --strict exit 1 on drift (for hooks / CI)
// If package.json's version is already tagged on origin and HEAD has commits after that tag,
// those commits are unreleased and the version must be bumped before the next release.
// The bump is the last commit; a published tag is never moved.
import { execSync } from "node:child_process";

const out = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
const version = JSON.parse(out(`node -p "JSON.stringify(require('./package.json').version)"`));
const tag = `v${version}`;
let remote = "";
try {
  remote = out(`git ls-remote origin refs/tags/${tag}^{}`) || out(`git ls-remote origin refs/tags/${tag}`);
} catch {
  console.log(`release-drift: could not reach origin; skipped.`);
  process.exit(0);
}
if (!remote) {
  console.log(`release-drift: ${tag} is not published yet; nothing to check.`);
  process.exit(0);
}
const tagged = remote.split(/\s+/)[0];
// The release commit (built lib/) sits on release/<tag>; its parent is the version bump on the branch.
let base = tagged;
try { base = out(`git rev-parse ${tagged}^`); } catch {}
let ahead = "";
try { ahead = out(`git log --oneline ${base}..HEAD`); } catch {
  console.log(`release-drift: ${tag} is not in this clone (git fetch --tags); skipped.`);
  process.exit(0);
}
if (!ahead) {
  console.log(`release-drift: HEAD is ${tag}; clean.`);
  process.exit(0);
}
console.log(`release-drift: ${tag} is already published, and these commits came after it:\n${ahead}\n` +
  `They are unreleased. Finish the work, then bump package.json to the next version as the last commit.`);
if (process.argv.includes("--strict")) process.exitCode = 1;
