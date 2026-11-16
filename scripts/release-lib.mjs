// Cut a package release that installs without a build step:
//   npm run release:lib -- v0.1.0
// 1. builds lib/ (with the fixture/vault guard) and runs the tests
// 2. makes a commit on release/<tag> that adds the built lib/ (lib/ is
//    git-ignored on normal branches, so it never lands in a PR)
// 3. tags that commit and returns to the branch you started from
// Rule: the version bump is the last commit before a release; start the next version on its own
//       branch. The guard below stops a release when commits sit on top of the bump.
// Between releases: npm run check:release-drift warns when commits sit on a published version.
// Run it only in a dedicated release worktree (checkout the announced SHA there): it switches
// branches, so in a worktree someone is working in, their next commit lands on the released branch.
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
// Guard (2026-11-17): a tag is cut once. If it already exists here or on origin, stop — never move a
// published tag; bump to the next version instead.
const localTag = out(`git tag -l ${tag}`);
let remoteTag = "";
try {
  remoteTag = out(`git ls-remote --tags origin refs/tags/${tag}`);
} catch {
  console.error(`Could not reach origin to check whether ${tag} exists. Check the network and run again.`);
  process.exit(1);
}
if (localTag || remoteTag) {
  console.error(`${tag} already exists${remoteTag ? " on origin" : " locally"}. A published tag is never moved: bump package.json to the next version and release that.`);
  process.exit(1);
}
// Guard (2026-11-17): the release is the version-bump commit itself. Work committed after the bump
// (the next version started on the same branch) would slip into this tag, so stop and say which commits.
const bump = out("git log -1 --format=%H -- package.json");
const head = out("git rev-parse HEAD");
if (bump !== head) {
  console.error(
    `HEAD is not the version-bump commit for ${tag}. These commits came after it and would be released too:\n` +
      out(`git log --oneline ${bump}..HEAD`) +
      `\nRelease from the bump commit (git checkout ${bump.slice(0, 7)}) or bump the version again on top.` +
      "\nStart the next version on its own branch.",
  );
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
// Leaving the release branch removes its tracked lib/; rebuild it so a local
// `npm pack` (e.g. a vendored tarball) still contains the package.
sh("npm run -s build:lib");
console.log(`\nTagged ${tag} on release/${tag}. Push: git push origin release/${tag} ${tag}`);
