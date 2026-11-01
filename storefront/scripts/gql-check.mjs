// Runs Hydrogen's GraphQL validation (`hydrogen gql check --fail-on-warn`).
//
// Windows workaround: in @shopify/hydrogen 2026.10.2 the check writes an
// absolute schema path such as `C:\...\storefront.schema.json`. gql.tada parses
// that string as a URL (scheme "c:") and tries to fetch it, so the check fails
// with "[Network] fetch failed". On Windows we write the same temporary config
// with a relative schema path and run the same gql.tada checker Hydrogen uses.
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";

const cwd = process.cwd();

function run(command, args) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

if (process.platform !== "win32") {
  run(process.execPath, [
    join(cwd, "node_modules", "@shopify", "hydrogen", "bin", "hydrogen.mjs"),
    "gql",
    "check",
    "--fail-on-warn",
  ]);
} else {
  const require = createRequire(import.meta.url);
  const hydrogenRoot = dirname(require.resolve("@shopify/hydrogen/package.json"));
  const hydrogenRequire = createRequire(join(hydrogenRoot, "package.json"));
  const gqlTadaCli = join(dirname(hydrogenRequire.resolve("gql.tada/package.json")), "bin", "cli.js");
  const schemaDir = relative(cwd, join(hydrogenRoot, "dist")).split("\\").join("/");
  const tmp = join(cwd, `.hydrogen-gql-${randomUUID()}.json`);

  writeFileSync(
    tmp,
    JSON.stringify({
      extends: "./tsconfig.json",
      compilerOptions: {
        plugins: [
          {
            name: "gql.tada/ts-plugin",
            schemas: [
              {
                name: "storefront",
                schema: `./${schemaDir}/storefront.schema.json`,
                tadaOutputLocation: "storefront-graphql-env.d.ts",
              },
              {
                name: "customer-account",
                schema: `./${schemaDir}/customer-account.schema.json`,
                tadaOutputLocation: "customer-account-graphql-env.d.ts",
              },
            ],
            trackFieldUsage: false,
          },
        ],
      },
    }),
    { flag: "wx" },
  );
  try {
    run(process.execPath, [gqlTadaCli, "check", "--tsconfig", tmp, "--level", "info", "--fail-on-warn"]);
  } finally {
    rmSync(tmp, { force: true });
  }
}
