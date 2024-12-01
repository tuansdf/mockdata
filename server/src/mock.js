import { faker } from "@faker-js/faker";

const MAX_OBJECTS = 100;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function keyToFn(key) {
  return key?.split(".").reduce((acc, k) => acc[k], faker);
}

function requestToFnsObject(data) {
  const result = {};
  for (const key of Object.keys(data)) {
    if (!data[key]) continue;
    if (typeof data[key] === "string") {
      const fn = keyToFn(data[key]);
      if (fn) result[key] = fn;
    } else if (isObject(data[key]) && data[key].key) {
      const fn = keyToFn(data[key]?.key);
      if (fn) result[key] = fn;
    }
  }
  return result;
}

async function generateJSON(fns) {
  const result = {};
  for (const key of Object.keys(fns)) {
    if (!fns[key]) continue;
    result[key] = await fns[key]?.();
  }
  return result;
}

export async function generateJSONs(data) {
  const { __count, ...input } = data;
  const fns = requestToFnsObject(input);
  let count = Number(__count);
  if (count !== 0 && !count) return generateJSON(fns);
  if (count < 0) count = 0;
  if (count > MAX_OBJECTS) count = MAX_OBJECTS;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateJSON(fns));
  }
  return await Promise.all(result);
}
