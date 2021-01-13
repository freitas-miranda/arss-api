import { Lock } from "lock";

export function promisifiedLock (): Function {
  const lock = Lock();

  return async (key: string) =>
    new Promise((resolve) => {
      lock(key, (release) => {
        resolve(promisifyRelease(release));
      });
    });
}

export function promisifyRelease (release: any) {
  return async () =>
    new Promise((resolve, reject) => {
      release((err: Error): void => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })();
    });
}

export default promisifiedLock;
