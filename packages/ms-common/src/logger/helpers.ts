import { levels } from "./config";

export const omitRowIndication = (term: string) => term.split(":").shift();
export const omitFilePathExtension = (filePath: string) => {
  const [relativePathWithoutExt] = filePath.split(".");
  return relativePathWithoutExt;
};
export function getTag(stack?: string) {
  // get invocation path
  const stackTrace = stack || new Error().stack
  
  const [, , ,invokePath] = stackTrace?.split(/\s+at.+premade\//).map(omitRowIndication) ?? [];
  if (!invokePath) return "";
  
  // convert to relative path
  const tag = omitFilePathExtension(invokePath).toUpperCase();

  return tag;
}

export const isLogLevelProperty = (property: unknown): boolean =>
  typeof property === "string" && Object.keys(levels).includes(property);
