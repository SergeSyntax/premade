import path from 'path';
import appRoot from 'app-root-path';
import { levels } from './config';

const omitRowIndication = (term: string) => term.split(':').shift();
const omitFilePathExtension = (filePath: string) => {
  const [relativePathWithoutExt] = filePath.split('.');
  return relativePathWithoutExt;
};
export function getTag() {
  // get invocation path
  const [, , invokePath] = new Error().stack?.split('file://').map(omitRowIndication) ?? [];
  if (!invokePath) return '';

  // convert to relative path
  const invocationFileRelativePath = path.relative(appRoot.toString(), invokePath);
  const tag = omitFilePathExtension(invocationFileRelativePath).toUpperCase();

  return tag;
}

export const isLogLevelProperty = (property: unknown): boolean =>
  typeof property === 'string' && Object.keys(levels).includes(property);
