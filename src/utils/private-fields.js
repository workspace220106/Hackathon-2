// Runtime helpers for the private-field pattern used across the codebase
// (equivalent to what esbuild emits for `#private` class members).
export const __publicField = (obj, key, value) => Object.defineProperty(obj, typeof key !== 'symbol' ? key + '' : key, { enumerable: true, configurable: true, writable: true, value });
const accessCheck = (obj, member, msg) => { if (!member.has(obj)) throw TypeError('Cannot ' + msg); };
export const __privateGet = (obj, member, getter) => (accessCheck(obj, member, 'read from private field'), getter ? getter.call(obj) : member.get(obj));
export const __privateAdd = (obj, member, value) => member.has(obj) ? (() => { throw TypeError('Cannot add the same private member more than once'); })() : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
export const __privateSet = (obj, member, value, setter) => (accessCheck(obj, member, 'write to private field'), setter ? setter.call(obj, value) : member.set(obj, value), value);
export const __privateMethod = (obj, member, method) => (accessCheck(obj, member, 'access private method'), method);
