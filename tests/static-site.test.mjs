import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds a self-contained GitHub Pages site", async () => {
  const html = await readFile(new URL("../dist-pages/index.html", import.meta.url), "utf8");
  const assets = await readdir(new URL("../dist-pages/assets/", import.meta.url));
  const scripts = assets.filter((name) => name.endsWith(".js"));
  const styles = assets.filter((name) => name.endsWith(".css"));

  assert.match(html, /<title>Private Membership/);
  assert.match(html, /Apply for access to a curated private community/);
  assert.match(html, /id="root"/);
  assert.equal(scripts.length, 1);
  assert.equal(styles.length, 1);

  const script = await readFile(new URL(`../dist-pages/assets/${scripts[0]}`, import.meta.url), "utf8");
  assert.match(script, /Join the waitlist/);
  assert.match(script, /VIP Waitlist/);
  assert.match(script, /supabase\.co/);
  assert.doesNotMatch(script, /service_role|sb_secret_/i);
});
