import path from "path";
import appRoot from "app-root-path";
import { levels } from "./config";

export const omitRowIndication = (term: string) => term.split(":").shift();
export const omitFilePathExtension = (filePath: string) => {
  const [relativePathWithoutExt] = filePath.split(".");
  return relativePathWithoutExt;
};
export function getTag(stack?: string) {
  // get invocation path
  const stackTrace = stack || new Error().stack
  const [, , ,invokePath] = stackTrace?.split(/\s+at.+\(/g).map(omitRowIndication) ?? [];
  if (!invokePath) return "";

  const normalizedInvokePath = path.normalize(invokePath);
  const normalizedAppRoot = path.normalize(appRoot.toString());
  const relativeInvokePath = path.relative(normalizedAppRoot, normalizedInvokePath);
  
  // convert to relative path
  const tag = omitFilePathExtension(relativeInvokePath).toUpperCase();

  return tag;
}

export const isLogLevelProperty = (property: unknown): boolean =>
  typeof property === "string" && Object.keys(levels).includes(property);
