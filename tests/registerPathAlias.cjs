/* eslint-disable @typescript-eslint/no-require-imports */
const Module = require("node:module");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const aliasPrefix = "@/";
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolvePathAlias(request, parent, isMain, options) {
  if (typeof request === "string" && request.startsWith(aliasPrefix)) {
    const resolvedRequest = path.join(projectRoot, request.slice(aliasPrefix.length));
    return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
