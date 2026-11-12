// Cut a package release that installs without a build step:
//   npm run release:lib -- v0.1.0
// 1. builds lib/ (with the fixture/vault guard) and runs the tests
// 2. makes a commit on release/<tag> that adds the built lib/ (lib/ is
//    git-ignored on normal branches, so it never lands in a PR)
// 3. tags that commit and returns to the branch you started from
// Push afterwards:  git push origin release/<tag> <tag>
// Consumers:        npm i github:Atlas322/thinking-state#<tag>
import { execSync } from "node:child_process";

const tag = process.argv[2];
if (!/^v\d+\.\d+\.\d+/.test(tag ?? "")) {
  console.error("Usage: npm run release:lib -- vX.Y.Z");
  process.exit(2);
}
const sh = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const out = (cmd) => execSync(cmd).toString().trim();

if (out("git status --porcelain --untracked-files=no")) {
  console.error("Commit or stash your changes first.");
  process.exit(1);
}
const version = JSON.parse(out("node -p \"JSON.stringify(require('./package.json').version)\""));
if (`v${version}` !== tag) {
  console.error(`package.json version is ${version}; bump it to ${tag.slice(1)} first.`);
  process.exit(1);
}
const start = out("git rev-parse --abbrev-ref HEAD");
sh("npm run -s build:lib");
sh("npx vitest run");
sh(`git checkout -b release/${tag}`);
try {
  sh("git add -f lib");
  sh(`git commit -m "Release ${tag}: built lib/ for git installs"`);
  sh(`git tag -a ${tag} -m "@inai/thinking-state ${tag}"`);
} finally {
  sh(`git checkout ${start}`);
}
console.log(`\nTagged ${tag} on release/${tag}. Push: git push origin release/${tag} ${tag}`);
