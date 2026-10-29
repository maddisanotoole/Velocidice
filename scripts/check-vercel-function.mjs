import { mkdir, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const projectRoot = process.cwd();
const temporaryParent = path.join(projectRoot, "node_modules", ".tmp");
await mkdir(temporaryParent, { recursive: true });
const temporaryRoot = await mkdtemp(path.join(temporaryParent, "velocidice-function-check-"));

try {
  const entry = path.join(projectRoot, "api", "game-events.ts");
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    rootDir: projectRoot,
    outDir: temporaryRoot,
    types: ["node"],
    skipLibCheck: true,
    strict: true,
    noEmitOnError: true,
  };
  const program = ts.createProgram([entry], options);
  const diagnostics = [...ts.getPreEmitDiagnostics(program), ...program.emit().diagnostics];

  if (diagnostics.length > 0) {
    process.stderr.write(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => projectRoot,
      getCanonicalFileName: fileName => fileName,
      getNewLine: () => "\n",
    }));
    process.exitCode = 1;
  } else {
    const emittedEntry = path.join(temporaryRoot, "api", "game-events.js");
    await import(pathToFileURL(emittedEntry));
    process.stdout.write("Vercel Function imports resolve under native Node.js ESM.\n");
  }
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
