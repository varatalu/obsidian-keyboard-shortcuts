var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// build/Main.js
__export(exports, {
  Plugin2: () => Plugin2,
  Plugin2$reflection: () => Plugin2$reflection,
  Plugin2_$ctor_Z7F5F6E8A: () => Plugin2_$ctor_Z7F5F6E8A
});

// build/fable_modules/fable-library.3.7.17/Util.js
function isArrayLike(x) {
  return Array.isArray(x) || ArrayBuffer.isView(x);
}
function isComparable(x) {
  return typeof x.CompareTo === "function";
}
function isEquatable(x) {
  return typeof x.Equals === "function";
}
function isHashable(x) {
  return typeof x.GetHashCode === "function";
}
function isDisposable(x) {
  return x != null && typeof x.Dispose === "function";
}
function disposeSafe(x) {
  if (isDisposable(x)) {
    x.Dispose();
  }
}
function sameConstructor(x, y) {
  var _a, _b;
  return ((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === ((_b = Object.getPrototypeOf(y)) === null || _b === void 0 ? void 0 : _b.constructor);
}
var Enumerator = class {
  constructor(iter) {
    this.iter = iter;
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    return this.current;
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    return this.current;
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const cur = this.iter.next();
    this.current = cur.value;
    return !cur.done;
  }
  ["System.Collections.IEnumerator.Reset"]() {
    throw new Error("JS iterators cannot be reset");
  }
  Dispose() {
    return;
  }
};
function getEnumerator(o) {
  return typeof o.GetEnumerator === "function" ? o.GetEnumerator() : new Enumerator(o[Symbol.iterator]());
}
function toIterator(en) {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const hasNext = en["System.Collections.IEnumerator.MoveNext"]();
      const current = hasNext ? en["System.Collections.IEnumerator.get_Current"]() : void 0;
      return { done: !hasNext, value: current };
    }
  };
}
function dateOffset(date) {
  const date1 = date;
  return typeof date1.offset === "number" ? date1.offset : date.kind === 1 ? 0 : date.getTimezoneOffset() * -6e4;
}
var ObjectRef = class {
  static id(o) {
    if (!ObjectRef.idMap.has(o)) {
      ObjectRef.idMap.set(o, ++ObjectRef.count);
    }
    return ObjectRef.idMap.get(o);
  }
};
ObjectRef.idMap = new WeakMap();
ObjectRef.count = 0;
function stringHash(s) {
  let i = 0;
  let h = 5381;
  const len = s.length;
  while (i < len) {
    h = h * 33 ^ s.charCodeAt(i++);
  }
  return h;
}
function numberHash(x) {
  return x * 2654435761 | 0;
}
function combineHashCodes(hashes) {
  if (hashes.length === 0) {
    return 0;
  }
  return hashes.reduce((h1, h2) => {
    return (h1 << 5) + h1 ^ h2;
  });
}
function dateHash(x) {
  return x.getTime();
}
function arrayHash(x) {
  const len = x.length;
  const hashes = new Array(len);
  for (let i = 0; i < len; i++) {
    hashes[i] = structuralHash(x[i]);
  }
  return combineHashCodes(hashes);
}
function structuralHash(x) {
  var _a;
  if (x == null) {
    return 0;
  }
  switch (typeof x) {
    case "boolean":
      return x ? 1 : 0;
    case "number":
      return numberHash(x);
    case "string":
      return stringHash(x);
    default: {
      if (isHashable(x)) {
        return x.GetHashCode();
      } else if (isArrayLike(x)) {
        return arrayHash(x);
      } else if (x instanceof Date) {
        return dateHash(x);
      } else if (((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === Object) {
        const hashes = Object.values(x).map((v) => structuralHash(v));
        return combineHashCodes(hashes);
      } else {
        return numberHash(ObjectRef.id(x));
      }
    }
  }
}
function equalArraysWith(x, y, eq) {
  if (x == null) {
    return y == null;
  }
  if (y == null) {
    return false;
  }
  if (x.length !== y.length) {
    return false;
  }
  for (let i = 0; i < x.length; i++) {
    if (!eq(x[i], y[i])) {
      return false;
    }
  }
  return true;
}
function equalArrays(x, y) {
  return equalArraysWith(x, y, equals);
}
function equalObjects(x, y) {
  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);
  if (xKeys.length !== yKeys.length) {
    return false;
  }
  xKeys.sort();
  yKeys.sort();
  for (let i = 0; i < xKeys.length; i++) {
    if (xKeys[i] !== yKeys[i] || !equals(x[xKeys[i]], y[yKeys[i]])) {
      return false;
    }
  }
  return true;
}
function equals(x, y) {
  var _a;
  if (x === y) {
    return true;
  } else if (x == null) {
    return y == null;
  } else if (y == null) {
    return false;
  } else if (typeof x !== "object") {
    return false;
  } else if (isEquatable(x)) {
    return x.Equals(y);
  } else if (isArrayLike(x)) {
    return isArrayLike(y) && equalArrays(x, y);
  } else if (x instanceof Date) {
    return y instanceof Date && compareDates(x, y) === 0;
  } else {
    return ((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === Object && equalObjects(x, y);
  }
}
function compareDates(x, y) {
  let xtime;
  let ytime;
  if ("offset" in x && "offset" in y) {
    xtime = x.getTime();
    ytime = y.getTime();
  } else {
    xtime = x.getTime() + dateOffset(x);
    ytime = y.getTime() + dateOffset(y);
  }
  return xtime === ytime ? 0 : xtime < ytime ? -1 : 1;
}
function comparePrimitives(x, y) {
  return x === y ? 0 : x < y ? -1 : 1;
}
function compareArraysWith(x, y, comp) {
  if (x == null) {
    return y == null ? 0 : 1;
  }
  if (y == null) {
    return -1;
  }
  if (x.length !== y.length) {
    return x.length < y.length ? -1 : 1;
  }
  for (let i = 0, j = 0; i < x.length; i++) {
    j = comp(x[i], y[i]);
    if (j !== 0) {
      return j;
    }
  }
  return 0;
}
function compareArrays(x, y) {
  return compareArraysWith(x, y, compare);
}
function compareObjects(x, y) {
  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);
  if (xKeys.length !== yKeys.length) {
    return xKeys.length < yKeys.length ? -1 : 1;
  }
  xKeys.sort();
  yKeys.sort();
  for (let i = 0, j = 0; i < xKeys.length; i++) {
    const key = xKeys[i];
    if (key !== yKeys[i]) {
      return key < yKeys[i] ? -1 : 1;
    } else {
      j = compare(x[key], y[key]);
      if (j !== 0) {
        return j;
      }
    }
  }
  return 0;
}
function compare(x, y) {
  var _a;
  if (x === y) {
    return 0;
  } else if (x == null) {
    return y == null ? 0 : -1;
  } else if (y == null) {
    return 1;
  } else if (typeof x !== "object") {
    return x < y ? -1 : 1;
  } else if (isComparable(x)) {
    return x.CompareTo(y);
  } else if (isArrayLike(x)) {
    return isArrayLike(y) ? compareArrays(x, y) : -1;
  } else if (x instanceof Date) {
    return y instanceof Date ? compareDates(x, y) : -1;
  } else {
    return ((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === Object ? compareObjects(x, y) : -1;
  }
}
function min(comparer, x, y) {
  return comparer(x, y) < 0 ? x : y;
}
var CURRIED = Symbol("curried");
function uncurry(arity, f) {
  if (f == null || f.length > 1) {
    return f;
  }
  const uncurried = (...args) => {
    let res = f;
    for (let i = 0; i < arity; i++) {
      res = res(args[i]);
    }
    return res;
  };
  uncurried[CURRIED] = f;
  return uncurried;
}
function _curry(args, arity, f) {
  return (arg) => arity === 1 ? f(...args.concat([arg])) : _curry(args.concat([arg]), arity - 1, f);
}
function curry(arity, f) {
  if (f == null || f.length === 1) {
    return f;
  } else if (CURRIED in f) {
    return f[CURRIED];
  } else {
    return _curry([], arity, f);
  }
}

// build/fable_modules/fable-library.3.7.17/Types.js
function seqToString(self) {
  let count = 0;
  let str = "[";
  for (const x of self) {
    if (count === 0) {
      str += toString(x);
    } else if (count === 100) {
      str += "; ...";
      break;
    } else {
      str += "; " + toString(x);
    }
    count++;
  }
  return str + "]";
}
function toString(x, callStack = 0) {
  var _a, _b;
  if (x != null && typeof x === "object") {
    if (typeof x.toString === "function") {
      return x.toString();
    } else if (Symbol.iterator in x) {
      return seqToString(x);
    } else {
      const cons = (_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor;
      return cons === Object && callStack < 10 ? "{ " + Object.entries(x).map(([k, v]) => k + " = " + toString(v, callStack + 1)).join("\n  ") + " }" : (_b = cons === null || cons === void 0 ? void 0 : cons.name) !== null && _b !== void 0 ? _b : "";
    }
  }
  return String(x);
}
function recordToJSON(self) {
  const o = {};
  const keys = Object.keys(self);
  for (let i = 0; i < keys.length; i++) {
    o[keys[i]] = self[keys[i]];
  }
  return o;
}
function recordToString(self) {
  return "{ " + Object.entries(self).map(([k, v]) => k + " = " + toString(v)).join("\n  ") + " }";
}
function recordGetHashCode(self) {
  const hashes = Object.values(self).map((v) => structuralHash(v));
  return combineHashCodes(hashes);
}
function recordEquals(self, other) {
  if (self === other) {
    return true;
  } else if (!sameConstructor(self, other)) {
    return false;
  } else {
    const thisNames = Object.keys(self);
    for (let i = 0; i < thisNames.length; i++) {
      if (!equals(self[thisNames[i]], other[thisNames[i]])) {
        return false;
      }
    }
    return true;
  }
}
function recordCompareTo(self, other) {
  if (self === other) {
    return 0;
  } else if (!sameConstructor(self, other)) {
    return -1;
  } else {
    const thisNames = Object.keys(self);
    for (let i = 0; i < thisNames.length; i++) {
      const result = compare(self[thisNames[i]], other[thisNames[i]]);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  }
}
var Record = class {
  toJSON() {
    return recordToJSON(this);
  }
  toString() {
    return recordToString(this);
  }
  GetHashCode() {
    return recordGetHashCode(this);
  }
  Equals(other) {
    return recordEquals(this, other);
  }
  CompareTo(other) {
    return recordCompareTo(this, other);
  }
};
var FSharpRef = class {
  constructor(contentsOrGetter, setter) {
    if (typeof setter === "function") {
      this.getter = contentsOrGetter;
      this.setter = setter;
    } else {
      this.getter = () => contentsOrGetter;
      this.setter = (v) => {
        contentsOrGetter = v;
      };
    }
  }
  get contents() {
    return this.getter();
  }
  set contents(v) {
    this.setter(v);
  }
};

// build/Main.js
var import_obsidian = __toModule(require("obsidian"));

// build/fable_modules/fable-library.3.7.17/Reflection.js
var TypeInfo = class {
  constructor(fullname, generics, construct, parent, fields, cases, enumCases) {
    this.fullname = fullname;
    this.generics = generics;
    this.construct = construct;
    this.parent = parent;
    this.fields = fields;
    this.cases = cases;
    this.enumCases = enumCases;
  }
  toString() {
    return fullName(this);
  }
  GetHashCode() {
    return getHashCode(this);
  }
  Equals(other) {
    return equals2(this, other);
  }
};
function getGenerics(t) {
  return t.generics != null ? t.generics : [];
}
function getHashCode(t) {
  const fullnameHash = stringHash(t.fullname);
  const genHashes = getGenerics(t).map(getHashCode);
  return combineHashCodes([fullnameHash, ...genHashes]);
}
function equals2(t1, t2) {
  if (t1.fullname === "") {
    return t2.fullname === "" && equalArraysWith(getRecordElements(t1), getRecordElements(t2), ([k1, v1], [k2, v2]) => k1 === k2 && equals2(v1, v2));
  } else {
    return t1.fullname === t2.fullname && equalArraysWith(getGenerics(t1), getGenerics(t2), equals2);
  }
}
function class_type(fullname, generics, construct, parent) {
  return new TypeInfo(fullname, generics, construct, parent);
}
function record_type(fullname, generics, construct, fields) {
  return new TypeInfo(fullname, generics, construct, void 0, fields);
}
var obj_type = new TypeInfo("System.Object");
var unit_type = new TypeInfo("Microsoft.FSharp.Core.Unit");
var char_type = new TypeInfo("System.Char");
var string_type = new TypeInfo("System.String");
var bool_type = new TypeInfo("System.Boolean");
var int8_type = new TypeInfo("System.SByte");
var uint8_type = new TypeInfo("System.Byte");
var int16_type = new TypeInfo("System.Int16");
var uint16_type = new TypeInfo("System.UInt16");
var int32_type = new TypeInfo("System.Int32");
var uint32_type = new TypeInfo("System.UInt32");
var float32_type = new TypeInfo("System.Single");
var float64_type = new TypeInfo("System.Double");
var decimal_type = new TypeInfo("System.Decimal");
function name(info) {
  if (Array.isArray(info)) {
    return info[0];
  } else if (info instanceof TypeInfo) {
    const elemType = getElementType(info);
    if (elemType != null) {
      return name(elemType) + "[]";
    } else {
      const i = info.fullname.lastIndexOf(".");
      return i === -1 ? info.fullname : info.fullname.substr(i + 1);
    }
  } else {
    return info.name;
  }
}
function fullName(t) {
  const elemType = getElementType(t);
  if (elemType != null) {
    return fullName(elemType) + "[]";
  } else if (t.generics == null || t.generics.length === 0) {
    return t.fullname;
  } else {
    return t.fullname + "[" + t.generics.map((x) => fullName(x)).join(",") + "]";
  }
}
function getElementType(t) {
  var _a;
  return t.fullname === "[]" && ((_a = t.generics) === null || _a === void 0 ? void 0 : _a.length) === 1 ? t.generics[0] : void 0;
}
function getRecordElements(t) {
  if (t.fields != null) {
    return t.fields();
  } else {
    throw new Error(`${t.fullname} is not an F# record type`);
  }
}
function getValue(propertyInfo, v) {
  return v[propertyInfo[0]];
}

// build/fable_modules/fable-library.3.7.17/Option.js
var Some = class {
  constructor(value2) {
    this.value = value2;
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
  GetHashCode() {
    return structuralHash(this.value);
  }
  Equals(other) {
    if (other == null) {
      return false;
    } else {
      return equals(this.value, other instanceof Some ? other.value : other);
    }
  }
  CompareTo(other) {
    if (other == null) {
      return 1;
    } else {
      return compare(this.value, other instanceof Some ? other.value : other);
    }
  }
};
function some(x) {
  return x == null || x instanceof Some ? new Some(x) : x;
}
function value(x) {
  if (x == null) {
    throw new Error("Option has no value");
  } else {
    return x instanceof Some ? x.value : x;
  }
}
function flatten(x) {
  return x == null ? void 0 : value(x);
}
function map(mapping, opt) {
  return opt != null ? some(mapping(value(opt))) : void 0;
}
function bind(binder, opt) {
  return opt != null ? binder(value(opt)) : void 0;
}

// build/fable_modules/Fable.Promise.3.1.3/Promise.fs.js
var PromiseBuilder = class {
  constructor() {
  }
};
function PromiseBuilder_$ctor() {
  return new PromiseBuilder();
}
function PromiseBuilder__Delay_62FBFDE1(_, generator) {
  return {
    then: (onSuccess, onError) => {
      try {
        return generator().then(onSuccess, onError);
      } catch (er) {
        if (onError == null) {
          return Promise.reject(er);
        } else {
          try {
            const a = onError(er);
            return Promise.resolve(a);
          } catch (er_1) {
            return Promise.reject(er_1);
          }
        }
      }
    },
    catch: (onError_1) => {
      try {
        return generator().catch(onError_1);
      } catch (er_2) {
        try {
          const a_1 = onError_1(er_2);
          return Promise.resolve(a_1);
        } catch (er_3) {
          return Promise.reject(er_3);
        }
      }
    }
  };
}
function PromiseBuilder__Run_212F1D4B(_, p) {
  return p.then((x) => x);
}

// build/fable_modules/Fable.Promise.3.1.3/PromiseImpl.fs.js
var promise = PromiseBuilder_$ctor();

// build/fable_modules/fable-library.3.7.17/RegExp.js
function escape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function match(reg, input, startAt = 0) {
  reg.lastIndex = startAt;
  return reg.exec(input);
}

// build/fable_modules/fable-library.3.7.17/String.js
function isNullOrEmpty(str) {
  return typeof str !== "string" || str.length === 0;
}
function join(delimiter, xs) {
  if (Array.isArray(xs)) {
    return xs.join(delimiter);
  } else {
    return Array.from(xs).join(delimiter);
  }
}
function split(str, splitters, count, options) {
  count = typeof count === "number" ? count : void 0;
  options = typeof options === "number" ? options : 0;
  if (count && count < 0) {
    throw new Error("Count cannot be less than zero");
  }
  if (count === 0) {
    return [];
  }
  const removeEmpty = (options & 1) === 1;
  const trim = (options & 2) === 2;
  splitters = splitters || [];
  splitters = splitters.filter((x) => x).map(escape);
  splitters = splitters.length > 0 ? splitters : ["\\s"];
  const splits = [];
  const reg = new RegExp(splitters.join("|"), "g");
  let findSplits = true;
  let i = 0;
  do {
    const match2 = reg.exec(str);
    if (match2 === null) {
      const candidate = trim ? str.substring(i).trim() : str.substring(i);
      if (!removeEmpty || candidate.length > 0) {
        splits.push(candidate);
      }
      findSplits = false;
    } else {
      const candidate = trim ? str.substring(i, match2.index).trim() : str.substring(i, match2.index);
      if (!removeEmpty || candidate.length > 0) {
        if (count != null && splits.length + 1 === count) {
          splits.push(trim ? str.substring(i).trim() : str.substring(i));
          findSplits = false;
        } else {
          splits.push(candidate);
        }
      }
      i = reg.lastIndex;
    }
  } while (findSplits);
  return splits;
}
function substring(str, startIndex, length2) {
  if (startIndex + (length2 || 0) > str.length) {
    throw new Error("Invalid startIndex and/or length");
  }
  return length2 != null ? str.substr(startIndex, length2) : str.substr(startIndex);
}

// build/Helpers.js
var obsidian = __toModule(require("obsidian"));

// build/fable_modules/fable-library.3.7.17/System.Text.js
var StringBuilder = class {
  constructor(value2, capacity) {
    this.buf = [];
    if (!isNullOrEmpty(value2)) {
      void this.buf.push(value2);
    }
  }
  toString() {
    const __ = this;
    return join("", __.buf);
  }
};
function StringBuilder_$ctor_Z18115A39(value2, capacity) {
  return new StringBuilder(value2, capacity);
}
function StringBuilder_$ctor_Z721C83C5(value2) {
  return StringBuilder_$ctor_Z18115A39(value2, 16);
}
function StringBuilder__Append_Z721C83C5(x, s) {
  void x.buf.push(s);
  return x;
}
function StringBuilder__Append_244C7CD6(x, c) {
  void x.buf.push(c);
  return x;
}

// build/fable_modules/fable-library.3.7.17/FSharp.Core.js
var LanguagePrimitives_GenericEqualityComparer = {
  ["System.Collections.IEqualityComparer.Equals541DA560"](x, y) {
    return equals(x, y);
  },
  ["System.Collections.IEqualityComparer.GetHashCode4E60E31B"](x_1) {
    return structuralHash(x_1);
  }
};
var LanguagePrimitives_GenericEqualityERComparer = {
  ["System.Collections.IEqualityComparer.Equals541DA560"](x, y) {
    return equals(x, y);
  },
  ["System.Collections.IEqualityComparer.GetHashCode4E60E31B"](x_1) {
    return structuralHash(x_1);
  }
};
function Operators_NullArg(x) {
  throw new Error(x);
}

// build/fable_modules/fable-library.3.7.17/Global.js
var SR_inputWasEmpty = "Collection was empty.";

// build/fable_modules/fable-library.3.7.17/Array.js
function Helpers_allocateArrayFromCons(cons, len) {
  if (typeof cons === "function") {
    return new cons(len);
  } else {
    return new Array(len);
  }
}
function fill(target, targetIndex, count, value2) {
  const start = targetIndex | 0;
  return target.fill(value2, start, start + count);
}
function map2(f, source, cons) {
  const len = source.length | 0;
  const target = Helpers_allocateArrayFromCons(cons, len);
  for (let i = 0; i <= len - 1; i++) {
    target[i] = f(source[i]);
  }
  return target;
}
function singleton(value2, cons) {
  const ar = Helpers_allocateArrayFromCons(cons, 1);
  ar[0] = value2;
  return ar;
}
function pairwise(array) {
  if (array.length < 2) {
    return [];
  } else {
    const count = array.length - 1 | 0;
    const result = new Array(count);
    for (let i = 0; i <= count - 1; i++) {
      result[i] = [array[i], array[i + 1]];
    }
    return result;
  }
}
function reverse(array) {
  const array_2 = array.slice();
  return array_2.reverse();
}

// build/fable_modules/fable-library.3.7.17/List.js
var FSharpList = class extends Record {
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
  }
  toString() {
    const xs = this;
    return "[" + join("; ", xs) + "]";
  }
  Equals(other) {
    const xs = this;
    if (xs === other) {
      return true;
    } else {
      const loop = (xs_1_mut, ys_1_mut) => {
        loop:
          while (true) {
            const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
            const matchValue = [xs_1.tail, ys_1.tail];
            if (matchValue[0] != null) {
              if (matchValue[1] != null) {
                const xt = matchValue[0];
                const yt = matchValue[1];
                if (equals(xs_1.head, ys_1.head)) {
                  xs_1_mut = xt;
                  ys_1_mut = yt;
                  continue loop;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else if (matchValue[1] != null) {
              return false;
            } else {
              return true;
            }
            break;
          }
      };
      return loop(xs, other);
    }
  }
  GetHashCode() {
    const xs = this;
    const loop = (i_mut, h_mut, xs_1_mut) => {
      loop:
        while (true) {
          const i = i_mut, h = h_mut, xs_1 = xs_1_mut;
          const matchValue = xs_1.tail;
          if (matchValue != null) {
            const t = matchValue;
            if (i > 18) {
              return h | 0;
            } else {
              i_mut = i + 1;
              h_mut = (h << 1) + structuralHash(xs_1.head) + 631 * i;
              xs_1_mut = t;
              continue loop;
            }
          } else {
            return h | 0;
          }
          break;
        }
    };
    return loop(0, 0, xs) | 0;
  }
  toJSON(_key) {
    const this$ = this;
    return Array.from(this$);
  }
  CompareTo(other) {
    const xs = this;
    const loop = (xs_1_mut, ys_1_mut) => {
      loop:
        while (true) {
          const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
          const matchValue = [xs_1.tail, ys_1.tail];
          if (matchValue[0] != null) {
            if (matchValue[1] != null) {
              const xt = matchValue[0];
              const yt = matchValue[1];
              const c = compare(xs_1.head, ys_1.head) | 0;
              if (c === 0) {
                xs_1_mut = xt;
                ys_1_mut = yt;
                continue loop;
              } else {
                return c | 0;
              }
            } else {
              return 1;
            }
          } else if (matchValue[1] != null) {
            return -1;
          } else {
            return 0;
          }
          break;
        }
    };
    return loop(xs, other) | 0;
  }
  GetEnumerator() {
    const xs = this;
    return ListEnumerator$1_$ctor_3002E699(xs);
  }
  [Symbol.iterator]() {
    return toIterator(this.GetEnumerator());
  }
  ["System.Collections.IEnumerable.GetEnumerator"]() {
    const xs = this;
    return getEnumerator(xs);
  }
};
var ListEnumerator$1 = class {
  constructor(xs) {
    this.xs = xs;
    this.it = this.xs;
    this.current = null;
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    const __ = this;
    return __.current;
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    const __ = this;
    return __.current;
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const __ = this;
    const matchValue = __.it.tail;
    if (matchValue != null) {
      const t = matchValue;
      __.current = __.it.head;
      __.it = t;
      return true;
    } else {
      return false;
    }
  }
  ["System.Collections.IEnumerator.Reset"]() {
    const __ = this;
    __.it = __.xs;
    __.current = null;
  }
  Dispose() {
  }
};
function ListEnumerator$1_$ctor_3002E699(xs) {
  return new ListEnumerator$1(xs);
}
function FSharpList__get_IsEmpty(xs) {
  return xs.tail == null;
}
function FSharpList__get_Length(xs) {
  const loop = (i_mut, xs_1_mut) => {
    loop:
      while (true) {
        const i = i_mut, xs_1 = xs_1_mut;
        const matchValue = xs_1.tail;
        if (matchValue != null) {
          i_mut = i + 1;
          xs_1_mut = matchValue;
          continue loop;
        } else {
          return i | 0;
        }
        break;
      }
  };
  return loop(0, xs) | 0;
}
function FSharpList__get_Head(xs) {
  const matchValue = xs.tail;
  if (matchValue != null) {
    return xs.head;
  } else {
    throw new Error(SR_inputWasEmpty + "\\nParameter name: list");
  }
}
function FSharpList__get_Tail(xs) {
  const matchValue = xs.tail;
  if (matchValue != null) {
    return matchValue;
  } else {
    throw new Error(SR_inputWasEmpty + "\\nParameter name: list");
  }
}
function toArray(xs) {
  const len = FSharpList__get_Length(xs) | 0;
  const res = fill(new Array(len), 0, len, null);
  const loop = (i_mut, xs_1_mut) => {
    loop:
      while (true) {
        const i = i_mut, xs_1 = xs_1_mut;
        if (!FSharpList__get_IsEmpty(xs_1)) {
          res[i] = FSharpList__get_Head(xs_1);
          i_mut = i + 1;
          xs_1_mut = FSharpList__get_Tail(xs_1);
          continue loop;
        }
        break;
      }
  };
  loop(0, xs);
  return res;
}

// build/fable_modules/fable-library.3.7.17/Seq.js
var SR_enumerationAlreadyFinished = "Enumeration already finished.";
var SR_enumerationNotStarted = "Enumeration has not started. Call MoveNext.";
var SR_keyNotFoundAlt2 = "An index satisfying the predicate was not found in the collection.";
var SR_resetNotSupported = "Reset is not supported on this enumerator.";
function Enumerator_noReset() {
  throw new Error(SR_resetNotSupported);
}
function Enumerator_notStarted() {
  throw new Error(SR_enumerationNotStarted);
}
function Enumerator_alreadyFinished() {
  throw new Error(SR_enumerationAlreadyFinished);
}
var Enumerator_Seq = class {
  constructor(f) {
    this.f = f;
  }
  toString() {
    const xs = this;
    const maxCount = 4;
    let i = 0;
    let str = "seq [";
    const e = getEnumerator(xs);
    try {
      while (i < maxCount && e["System.Collections.IEnumerator.MoveNext"]()) {
        if (i > 0) {
          str = str + "; ";
        }
        str = str + toString(e["System.Collections.Generic.IEnumerator`1.get_Current"]());
        i = i + 1 | 0;
      }
      if (i === maxCount) {
        str = str + "; ...";
      }
      return str + "]";
    } finally {
      disposeSafe(e);
    }
  }
  GetEnumerator() {
    const x = this;
    return x.f();
  }
  [Symbol.iterator]() {
    return toIterator(this.GetEnumerator());
  }
  ["System.Collections.IEnumerable.GetEnumerator"]() {
    const x = this;
    return x.f();
  }
};
function Enumerator_Seq_$ctor_673A07F2(f) {
  return new Enumerator_Seq(f);
}
var Enumerator_FromFunctions$1 = class {
  constructor(current, next, dispose) {
    this.current = current;
    this.next = next;
    this.dispose = dispose;
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    const __ = this;
    return __.current();
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    const __ = this;
    return __.current();
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const __ = this;
    return __.next();
  }
  ["System.Collections.IEnumerator.Reset"]() {
    Enumerator_noReset();
  }
  Dispose() {
    const __ = this;
    __.dispose();
  }
};
function Enumerator_FromFunctions$1_$ctor_58C54629(current, next, dispose) {
  return new Enumerator_FromFunctions$1(current, next, dispose);
}
function Enumerator_concat(sources) {
  let outerOpt = void 0;
  let innerOpt = void 0;
  let started = false;
  let finished = false;
  let curr = void 0;
  const finish = () => {
    finished = true;
    if (innerOpt != null) {
      const inner = innerOpt;
      try {
        disposeSafe(inner);
      } finally {
        innerOpt = void 0;
      }
    }
    if (outerOpt != null) {
      const outer = outerOpt;
      try {
        disposeSafe(outer);
      } finally {
        outerOpt = void 0;
      }
    }
  };
  return Enumerator_FromFunctions$1_$ctor_58C54629(() => {
    if (!started) {
      Enumerator_notStarted();
    } else if (finished) {
      Enumerator_alreadyFinished();
    }
    if (curr != null) {
      return value(curr);
    } else {
      return Enumerator_alreadyFinished();
    }
  }, () => {
    let copyOfStruct;
    if (!started) {
      started = true;
    }
    if (finished) {
      return false;
    } else {
      let res = void 0;
      while (res == null) {
        const matchValue = [outerOpt, innerOpt];
        if (matchValue[0] != null) {
          if (matchValue[1] != null) {
            const inner_1 = matchValue[1];
            if (inner_1["System.Collections.IEnumerator.MoveNext"]()) {
              curr = some(inner_1["System.Collections.Generic.IEnumerator`1.get_Current"]());
              res = true;
            } else {
              try {
                disposeSafe(inner_1);
              } finally {
                innerOpt = void 0;
              }
            }
          } else {
            const outer_1 = matchValue[0];
            if (outer_1["System.Collections.IEnumerator.MoveNext"]()) {
              const ie = outer_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
              innerOpt = (copyOfStruct = ie, getEnumerator(copyOfStruct));
            } else {
              finish();
              res = false;
            }
          }
        } else {
          outerOpt = getEnumerator(sources);
        }
      }
      return value(res);
    }
  }, () => {
    if (!finished) {
      finish();
    }
  });
}
function Enumerator_enumerateThenFinally(f, e) {
  return Enumerator_FromFunctions$1_$ctor_58C54629(() => e["System.Collections.Generic.IEnumerator`1.get_Current"](), () => e["System.Collections.IEnumerator.MoveNext"](), () => {
    try {
      disposeSafe(e);
    } finally {
      f();
    }
  });
}
function Enumerator_generateWhileSome(openf, compute, closef) {
  let started = false;
  let curr = void 0;
  let state = some(openf());
  const dispose = () => {
    if (state != null) {
      const x_1 = value(state);
      try {
        closef(x_1);
      } finally {
        state = void 0;
      }
    }
  };
  const finish = () => {
    try {
      dispose();
    } finally {
      curr = void 0;
    }
  };
  return Enumerator_FromFunctions$1_$ctor_58C54629(() => {
    if (!started) {
      Enumerator_notStarted();
    }
    if (curr != null) {
      return value(curr);
    } else {
      return Enumerator_alreadyFinished();
    }
  }, () => {
    if (!started) {
      started = true;
    }
    if (state != null) {
      const s = value(state);
      let matchValue_1;
      try {
        matchValue_1 = compute(s);
      } catch (matchValue) {
        finish();
        throw matchValue;
      }
      if (matchValue_1 != null) {
        curr = matchValue_1;
        return true;
      } else {
        finish();
        return false;
      }
    } else {
      return false;
    }
  }, dispose);
}
function Enumerator_unfold(f, state) {
  let curr = void 0;
  let acc = state;
  return Enumerator_FromFunctions$1_$ctor_58C54629(() => {
    if (curr != null) {
      const x = curr[0];
      const st = curr[1];
      return x;
    } else {
      return Enumerator_notStarted();
    }
  }, () => {
    curr = f(acc);
    if (curr != null) {
      const x_1 = curr[0];
      const st_1 = curr[1];
      acc = st_1;
      return true;
    } else {
      return false;
    }
  }, () => {
  });
}
function indexNotFound() {
  throw new Error(SR_keyNotFoundAlt2);
}
function checkNonNull(argName, arg) {
  if (arg == null) {
    Operators_NullArg(argName);
  }
}
function mkSeq(f) {
  return Enumerator_Seq_$ctor_673A07F2(f);
}
function ofSeq2(xs) {
  checkNonNull("source", xs);
  return getEnumerator(xs);
}
function delay(generator) {
  return mkSeq(() => getEnumerator(generator()));
}
function concat(sources) {
  return mkSeq(() => Enumerator_concat(sources));
}
function unfold(generator, state) {
  return mkSeq(() => Enumerator_unfold(generator, state));
}
function empty() {
  return delay(() => new Array(0));
}
function singleton2(x) {
  return delay(() => singleton(x));
}
function ofArray2(arr) {
  return arr;
}
function toArray2(xs) {
  if (xs instanceof FSharpList) {
    return toArray(xs);
  } else {
    return Array.from(xs);
  }
}
function generate(create2, compute, dispose) {
  return mkSeq(() => Enumerator_generateWhileSome(create2, compute, dispose));
}
function append(xs, ys) {
  return concat([xs, ys]);
}
function choose(chooser, xs) {
  return generate(() => ofSeq2(xs), (e) => {
    let curr = void 0;
    while (curr == null && e["System.Collections.IEnumerator.MoveNext"]()) {
      curr = chooser(e["System.Collections.Generic.IEnumerator`1.get_Current"]());
    }
    return curr;
  }, (e_1) => {
    disposeSafe(e_1);
  });
}
function enumerateUsing(resource, source) {
  const compensation = () => {
    if (equals(resource, null)) {
    } else {
      let copyOfStruct = resource;
      disposeSafe(copyOfStruct);
    }
  };
  return mkSeq(() => {
    try {
      return Enumerator_enumerateThenFinally(compensation, ofSeq2(source(resource)));
    } catch (matchValue_1) {
      compensation();
      throw matchValue_1;
    }
  });
}
function enumerateWhile(guard, xs) {
  return concat(unfold((i) => guard() ? [xs, i + 1] : void 0, 0));
}
function filter(f, xs) {
  return choose((x) => {
    if (f(x)) {
      return some(x);
    } else {
      return void 0;
    }
  }, xs);
}
function tryFind(predicate, xs) {
  const e = ofSeq2(xs);
  try {
    let res = void 0;
    while (res == null && e["System.Collections.IEnumerator.MoveNext"]()) {
      const c = e["System.Collections.Generic.IEnumerator`1.get_Current"]();
      if (predicate(c)) {
        res = some(c);
      }
    }
    return res;
  } finally {
    disposeSafe(e);
  }
}
function find(predicate, xs) {
  const matchValue = tryFind(predicate, xs);
  if (matchValue == null) {
    return indexNotFound();
  } else {
    return value(matchValue);
  }
}
function tryFindIndex(predicate, xs) {
  const e = ofSeq2(xs);
  try {
    const loop = (i_mut) => {
      loop:
        while (true) {
          const i = i_mut;
          if (e["System.Collections.IEnumerator.MoveNext"]()) {
            if (predicate(e["System.Collections.Generic.IEnumerator`1.get_Current"]())) {
              return i;
            } else {
              i_mut = i + 1;
              continue loop;
            }
          } else {
            return void 0;
          }
          break;
        }
    };
    return loop(0);
  } finally {
    disposeSafe(e);
  }
}
function fold(folder, state, xs) {
  const e = ofSeq2(xs);
  try {
    let acc = state;
    while (e["System.Collections.IEnumerator.MoveNext"]()) {
      acc = folder(acc, e["System.Collections.Generic.IEnumerator`1.get_Current"]());
    }
    return acc;
  } finally {
    disposeSafe(e);
  }
}
function iterate(action, xs) {
  fold((unitVar, x) => {
    action(x);
  }, void 0, xs);
}
function map3(mapping, xs) {
  return generate(() => ofSeq2(xs), (e) => e["System.Collections.IEnumerator.MoveNext"]() ? some(mapping(e["System.Collections.Generic.IEnumerator`1.get_Current"]())) : void 0, (e_1) => {
    disposeSafe(e_1);
  });
}
var CachedSeq$1 = class {
  constructor(cleanup, res) {
    this.cleanup = cleanup;
    this.res = res;
  }
  Dispose() {
    const _ = this;
    _.cleanup();
  }
  GetEnumerator() {
    const _ = this;
    return getEnumerator(_.res);
  }
  [Symbol.iterator]() {
    return toIterator(this.GetEnumerator());
  }
  ["System.Collections.IEnumerable.GetEnumerator"]() {
    const _ = this;
    return getEnumerator(_.res);
  }
};
function where(predicate, xs) {
  return filter(predicate, xs);
}
function pairwise2(xs) {
  return delay(() => ofArray2(pairwise(toArray2(xs))));
}

// build/Helpers.js
function Command_defaultCommand() {
  let mid = "";
  let mname = "";
  let _cb = void 0;
  let _ccb = void 0;
  let _hotkeys = void 0;
  let _editorCallback = void 0;
  let _editorCheckCallback = void 0;
  return new class {
    get callback() {
      return _cb;
    }
    set callback(v) {
      _cb = v;
    }
    get checkCallback() {
      return _ccb;
    }
    set checkCallback(v_1) {
      _ccb = v_1;
    }
    get editorCallback() {
      return uncurry(2, _editorCallback);
    }
    set editorCallback(v_2) {
      _editorCallback = curry(2, v_2);
    }
    get editorCheckCallback() {
      return uncurry(3, _editorCheckCallback);
    }
    set editorCheckCallback(v_3) {
      _editorCheckCallback = curry(3, v_3);
    }
    get hotkeys() {
      return _hotkeys;
    }
    set hotkeys(v_4) {
      _hotkeys = v_4;
    }
    get icon() {
      return void 0;
    }
    set icon(v_5) {
    }
    get id() {
      return mid;
    }
    set id(v_6) {
      mid = v_6;
    }
    get mobileOnly() {
      return void 0;
    }
    set mobileOnly(v_7) {
    }
    get name() {
      return mname;
    }
    set name(v_8) {
      mname = v_8;
    }
  }();
}
function Command_forMenu(id, name2, callback) {
  const cmd = Command_defaultCommand();
  cmd.id = id;
  cmd.name = name2;
  cmd.callback = callback;
  return cmd;
}
function Command_forEditor(id, name2, callback) {
  const cmd = Command_defaultCommand();
  cmd.id = id;
  cmd.name = name2;
  cmd.editorCallback = callback;
  return cmd;
}
function SuggestModal_create(app) {
  return new obsidian.SuggestModal(app);
}
function SuggestModal_withGetSuggestions(query, sm) {
  sm.getSuggestions = query;
  return sm;
}
function SuggestModal_withOnChooseSuggestion(fn, sm) {
  sm.onChooseSuggestion = (f, eventargs) => {
    fn(f);
  };
  return sm;
}
function SuggestModal_withRenderSuggestion(fn, sm) {
  sm.renderSuggestion = (sugg, elem) => {
    fn(sugg, elem);
    return void 0;
  };
  return sm;
}
function Notice_show(text) {
  let objectArg;
  objectArg = obsidian.Notice, new objectArg(text);
}
var Content_CodeBlockContent = class extends Record {
  constructor(startLine, content) {
    super();
    this.startLine = startLine | 0;
    this.content = content;
  }
};
function Content_getTags(app) {
  let option, objectArg;
  return bind((f) => f.tags, (option = app.workspace.getActiveFile(), bind((objectArg = app.metadataCache, (arg) => objectArg.getFileCache(arg)), option)));
}
function Content_getCodeBlocks(app) {
  let option, objectArg_1;
  let view;
  const arg = obsidian.MarkdownView;
  const objectArg = app.workspace;
  view = objectArg.getActiveViewOfType(arg);
  if (view == null) {
    return void 0;
  } else {
    const view_1 = value(view);
    const lines = split(view_1.getViewData(), ["\n"], null, 0);
    const codeBlockSections = flatten(map((f) => map((d) => where((d_1) => d_1.type === "code", d), f.sections), flatten((option = app.workspace.getActiveFile(), map((objectArg_1 = app.metadataCache, (arg_1) => objectArg_1.getFileCache(arg_1)), option)))));
    const codeBlockTexts = map((optionalCodeblockSections) => toArray2(map3((f_1) => {
      const startLine = ~~f_1.position.start.line + 1 | 0;
      const endLine = ~~f_1.position.end.line - 1 | 0;
      const blockContent = lines.slice(startLine, endLine + 1);
      return new Content_CodeBlockContent(startLine, join("\n", blockContent));
    }, optionalCodeblockSections)), codeBlockSections);
    return codeBlockTexts;
  }
}
function Seq_skipSafe(num, source) {
  return delay(() => enumerateUsing(getEnumerator(source), (e) => {
    let idx = 0;
    let loop = true;
    return append(enumerateWhile(() => idx < num && loop, delay(() => append(!e["System.Collections.IEnumerator.MoveNext"]() ? (loop = false, empty()) : empty(), delay(() => {
      idx = idx + 1 | 0;
      return empty();
    })))), delay(() => enumerateWhile(() => e["System.Collections.IEnumerator.MoveNext"](), delay(() => singleton2(e["System.Collections.Generic.IEnumerator`1.get_Current"]())))));
  }));
}
var PluginSettings = class extends Record {
  constructor(defaultCodeBlockLanguage, defaultCalloutType) {
    super();
    this.defaultCodeBlockLanguage = defaultCodeBlockLanguage;
    this.defaultCalloutType = defaultCalloutType;
  }
};
function PluginSettings$reflection() {
  return record_type("Fs.Obsidian.Helpers.PluginSettings", [], PluginSettings, () => [["defaultCodeBlockLanguage", string_type], ["defaultCalloutType", string_type]]);
}
function PluginSettings_get_Default() {
  return new PluginSettings("bash", "info");
}
function PluginSettingsModule_withDynamicProp(key, value2, settings) {
  switch (key) {
    case "defaultCodeBlockLanguage": {
      return new PluginSettings(value2, settings.defaultCalloutType);
    }
    case "defaultCalloutType": {
      return new PluginSettings(settings.defaultCodeBlockLanguage, value2);
    }
    default: {
      throw new Error(`unknown property ${key}`);
    }
  }
}
function Clipboard_write(txt) {
  const matchValue = navigator.clipboard;
  if (matchValue != null) {
    const v = matchValue;
    return v.writeText(txt);
  } else {
    return PromiseBuilder__Run_212F1D4B(promise, PromiseBuilder__Delay_62FBFDE1(promise, () => {
      return Promise.resolve();
    }));
  }
}

// build/fable_modules/fable-library.3.7.17/Unicode.13.0.0.js
var rangeDeltas = "#C$&$&$$$$$$%-%&%=$$$$$$=$$$$D$$'$$$$$$$$$$$$%$$%$$$$&$:$*;$+$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%$$$$$$$$$$$$$$$%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%$$$$&%$$$%$&%'$%$&&%$%$$$$$%$$%$$%$&$$$%%$$&'$$$$$$$$$$$$$$$$$$$$$$$$%$$$$$$$$$$$$$$$$$%$$$$$&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*%$%%$$'$$$$$$$$h$>5'/1(*$$$4\x93$$$$$$$$%$&$$'%$$&$$$%$4$,F$%&&$$$$$$$$$$$$$$$$$$$$$$$($$$$$%%VS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$(%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%$$$$$$$$$$$$%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$I%$)L$$%%$$P$$$%$%$$+>''%.)&%$%%.$$$%C$-8-'%$\x86$$*$$)%%$'%-&%$1$$$$A>%|.$1-D,%$&$%$%9'$,$&$(%2$<&%$$.X8$5.2$C$Y$$$$&+'$%$*-%%-$$2$%$+%%%9$*$$&'%$$&'%%%%$$+$'%$&%%-%%)$$$$$%%$$)'%%9$*$%$%$%%$$&%'%%&&$*'$$*-%&$$-%$$,$&$9$*$%$(%$$&($%$$%$%$2%%%-$$*$)$$%$+%%%9$*$%$(%$$$$$'%%%%$*%$'%$&%%-$$)-$$$)&&$'&%$$$%&%&&&/'%$%&&$&$%$)$1-&)$$($&$+$&$:$3&$&'$&$'*%$&(%%%-*$*$$$%$+$&$:$-$(%$$$$($$%$%%*%*$$%%%-$%0%%,$&$L%$&'$&$&$$$'&$*&%%-,$)$$%$5&;$,$$%*&$'&&$$$+)-%%$/S$%*'$)$+$-%H%$$$($;$$$-$%,$%($$$)%-%'C$&2$$&%)--$$$$$$$$$$%+$G'1$($%(.$G$+$)$%('%HN%'$)$%%%$-))%%'&$&%*&'0$%%)$$$-&$%I$$($%N$$&\u016C$'%*$$$'%L$'%D$'%*$$$'%2$\\$'%f%&,7&3-)y%)%$\u028F$$4$=$$&n&&+*0$'&.5&%,5%/0$&$%/W%$*+$%.&$&$$$%-)-))$'&$$-)F$X*(%E$$(i-B$&'%&'%$)&'$&%-A%(.O'=)-$&E:%%$%%X$$$*$$$$%+)-%$-)-)*$)%1$%b'$R$$($$($%*'-*-,,&%$A$'%%$&%-O$$%&$$&%+'G++%%&(-&&-A)%,*N%&++&$0$*'$)$%$%$(Ob0$EH]$($$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$,$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$,+)%)%++++)%)%+$$$$$$$$++1%++++++($%'$$$&&$%'$&'%%'$&+(&%&$%'$%$.()%$$$%$$$+$$($,$$'%&$$$.$$$-$($-$$%)&$$$-&$$$0&C30'$&/2%$'$%$&%&$$$%$()$$$$$$'$$'$'$%%%($'$$%$$3F$$'$%'((%'$%$%$*$B%%$$$B\u012F+$$$$7%*$$t$A<K)h<.8_q9\xDA$,$Y+\x92$\u011B$$$$$$$$$$$$$$AO($$B$$$$$$$$$$3\u0123\xA6$$$$$$$$$$$$$$$$$$$$$$b$$$$C$$\u0125S8%)J%C$\x8CR$R$$$&%$$$$$$'$$%$)%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%)$$$$&$$('$%I$$($%[*$$1$:,*$*$*$*$*$*$*$*$C%$$$$&$$$$$,$%$$$$%$$$$$$$$$$($-%'$$$0%$P=$|/\xF9=/'$&$$$$$$$$$$$$$$%$$$$$$$$$$%$,'%$(%&$$$%$y%%%%$$}$&$(N$\x81$%'-CG/3B$-A+$2C-J2\u0163\u19E3c\u5220&8$\u049A&Z,K)%\u012F$&3-%7$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&$-$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%%i-%)+:,%$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$+$$$$%$$$$$$$$$$%$$$$$$$$&$$$$$$$$$$$$$$$$$$$$($($$$$$$$$$$$%$$'$$$M$$$%$*$&$'$:%%$'$&)%$$)W'+%U3%+%-)5)&$$%$-?+%:.%.$@&&$R$%'%%&0$$-'%($$,-($L)%%%%,&$+$$%-%'3$)&$$$$U$$&%%(%$$$;%$%.$%%%$%$$-)%)%),*$*$N$',$%'sF%$%$%$$$%-)\u2BC7/:'T'\u0823\u1923\u0191%\x8DI*/(($$-$0$($$$%$%$\x8F34\u018E$$3c%YK/$$%3*$$$)3$%%$$$$$$$$$$$$$$$$%$$'&&$'$$$$$$$&$$&$$$%'($\xAA%$$&$&$$$$$$%-%&%=$$$$$$=$$$$$$$$$%-$P%B&)%)%)%&&%$$$%$$'%-&%%/$=$6$%$2%1E\x9E(&'P&,X'4%&$0&$RP$\xA5@&T2$>'C',7$+$(I((A$$G'+$(MKKq%-)G'G'K+W.$\xB3\u015A,9-+\xBB)%$$O$%&$%:$$+:%*B+,S6$%((9)&$=($c['%%3%Q$&$%(''$&$@%&'$,*,*@%$@&C+$?%'(*,Y&*9%+6(+5*'/*slZV0V*)G'+-\u0149B$M$%$%%q@-$+9.'(y8*7:,$$$X2*'7-2&$P&'%%%$'.$%<*-)&G($+$-'$%$+F$%$,%$S&,%'''$$$-$$$&$7.5$<&&%$$%)$d*$$$'$2$-$)R$&+(-)%%$+%%%9$*$%$($%$%$'%%%&%$)$((%%*&(\xAEX&+%&$$'(-%$$$&AS&)$$'%$%%$$+-\xC9R&'%'%$%:'%ES&+%$$%&$.-)06N$$$%)$$$*-Y>%&%'$('-%&$\xE3O&,$%$\x87CC-,/+%$%+$%$;)$%%%$$$$$$$&,-i+%J&'%%'$$$$$>$-K)$$'+$+$)%&Q0$%&$(@\\\u012A,$H$*$)$$$(--6&%A%9$$*$%$%l*$%$I)&$$%$*$$+-))$%$C($%$%$$$$*-\u01596%%%\xDA$28+'40$\u03BD\x89\x92$(.\xE7\u0ADF\u0452$,\u0FEA\u026A\u21DC\u025C*B$-'%\x83A%($-S*(''$$--$*$8(6\u02D3CC:'\x88n'$$Z*'0c%$$$.%1\u181B+\u04F9M,\u231A\u0142T&4'+\u01AF\u0927\x8E(0&,*-%$%$'\u137F\u0119-J%_%&&)++%*A'^:e&$\xBD7/z,<\xAA===*$5==$$%%$%%%'$+'$$$*$.==%$'%+$*$=%$'$($$&*$============?%<$<$)<$<$)<$<$)<$<$)<$<$)$$%U\u0223Z'U+$1$%(2($2\u0573*$4%*$%$(\xF8P&**%-'$$\u0193O'-($\u0523\xE8%,*LEE*$'-'%\u0334^$&$'oP$2\xE5'$>$%$$%$$-$'$$$$)$'$$$$$$&$%$$%$$$$$$$$$$%$$%'$*$'$'$$$-$4(&$($4W%\u0131O'\x87/2%2$2$H-0\xC4[@0O',*%1)\xBD\u011E(\u02FB+0&0&\x97/|*/7/'[+-)K+A%%q\x9C$u$\xAA/1%(&&(*,<**,&0*L\xB6$ZH-\u0429\uA701E\u1058.\u0101%\u16A51\u1D54\u0C42\u0241\u0605\u136E\u{AECD9}$A\x83\xA3\u0113\uFE33\u{10021}%\u{10021}";
var categories = "1.;=;78;<;6;+;<;#7;8>5>$7<8<1.;=?;>?'9<2?>?<->$;>-':-;#<#$<$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$'#$'#%$#%$#%$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#%$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$'$&>&>&>&>&>(#$#$&>#$@&$;#@>#;#@#@#$#@#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$<#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$?(*#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$@#@&;$;6@?=@(6(;(;(;(@'@';@2<;=;?(;2@;'&'(+;'(';'(2?(&(?('+'?';@2'('(@'('@+'(&?;&@(='(&(&(&(@;@'(@;@'@'@'@(2()'()(')()()'('(;+;&'()@'@'@'@'@'@'@(')(@)@)('@)@'@'(@+'=-?=';(@()@'@'@'@'@'@'@'@(@)(@(@(@(@'@'@+('(;@()@'@'@'@'@'@'@(')(@()@)(@'@'(@+;=@'(@()@'@'@'@'@'@'@(')()(@)@)(@()@'@'(@+?'-@('@'@'@'@'@'@'@'@'@'@)()@)@)(@'@)@+-?=?@()('@'@'@'@'()@(@(@(@'@'(@+@;-?'();'@'@'@'@'@(')()@()@)(@)@'@'(@+@'@()'@'@'(')(@)@)('?@')-'(@+-?'@()@'@'@'@'@'@(@)(@(@)@+@);@'('(@='&(;+;@'@'@'@'@'@'('('@'@&@(@+@'@'?;?;?(?+-?(?(?(7878)'@'@()(;('(@(@?(?@?;?;@')()()()('+;')('(')')'('()()(')+)(?#@#@#@$;&$'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@(;-@'?@#@$@6'?;'.'78@';,'@'@'(@'(;@'(@'@'@(@'()()()(;&;='(@+@-@;6;(2@+@'&'@'('('@'@'@()()@)()(@?@;+'@'@'@'@+-@?'()(@;')()(@()()()(@(+@+@;&;@(*(@()'()()()()'@+;?(?@()')()()('+'()()()()@;')()(@;+@'+'&;$@#@#;@(;()('('(')('@$&$&$&(@(#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$@#@$#$#$@#@$@#@#@#@#$#$@$%$%$%$@$#%>$>$@$#%>$@$#@>$#>@$@$#%>@.26;9:79:79;/02.;9:;5;<78;<;5;.2@2-&@-<78&-<78@&@=@(*(*(@?#?#?$#$#$?#?<#?#?#?#?#?$#$'$?$#<#$?<?$?-,#$,-?@<?<?<?<?<?<?<?<?<?<?7878?<?78?<?<?<?@?@-?-?<?<?<?<?78787878787878-?<78<7878787878<?<7878787878787878787878<7878<78<?<?<?@?@?#@$@#$#$#$#$#$#$#$#$&#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$?#$#$(#$@;-;$@$@$@'@&;@('@'@'@'@'@'@'@'@'@(;9:9:;9:;9:;6;6;9:;9:78787878;&;6;6;7;?;@?@?@?@?@.;?&',7878787878?78787878678?,()6&?,&';?@'@(>&'6';&'@'@'@?-?'?@'?@-?-?-?-?-?'?'@'&'@?@'&;'&;'+'@#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$'(*;(;&#$#$#$#$#$#$#$#$#$#$#$#$#$#$&(',(;@>&>#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$&$#$#$#$#$#$#$#$&>#$#$'#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$@#$#$#$@#$'&$'('('(')()?(@-?=?@';@)')(@;+@(';';'(+'(;'()@;'@()'()()();@&+@;'(&'+'@'()()(@'('()@+@;'&'?')()'('('('('('@'&;')();'&)(@'@'@'@'@'@$>&$&>@$')()();)(@+@'@'@'@34'@'@$@$@'('<'@'@'@'@'@'>@'87@'@'@'=?@(;78;@(;657878787878787878;78;5;@;6787878;<6<@;=;@'@'@2@;=;78;<;6;+;<;#7;8>5>$7<8<78;78;'&'&'@'@'@'@'@=<>?=@?<?@2?@'@'@'@'@'@'@'@;@-@?,-?-?@?@?@?(@'@'@(-@'-@',',@'(@'@;'@';,@#$'@+@#@$@'@'@;@'@'@'@'@'@'@'@'@'@;-'?-'@-@'@'@-'-@;'@;@'@-'-@-'(@(@('@'@'@(@(-@;@'-;'-@'?'(@-;@'@;'@-'@-'@;@-@'@#@$@-'(@+@-@'@(6@'@'-'@'(-;@'-@'@)()'(;@-+@()')()(;2;@2@'@+@('()(@+;')'@'(;'@()')()';(;)(+';';@-@'@')()()(;(@'@'@'@'@';@'()(@+@()@'@'@'@'@'@'@(')()@)@)@'@)@')@(@(@')()()(';+;@;('@')()()()(';'@+@')(@)()(;'(@')()()(;'@+@;@'()()()('@+@'@()()(@+-;?@')()(;@#$+-@'@'@'@'@')@)@()(')')(;@+@'@')(@()(';')@'('()'(;(@'()('()(;';@'@'@')(@()(';@+-@;'@(@)()()(@'@'@'(@(@(@('(@+@'@'@')@(@)()('@+@'();@'@-?=?@;'@,@;@'@'@2@'@'@'@+@;@'@(;@'(;?&;?@+@-@'@'@#$-;@'@(')@(&@&;&(@)@'@'@'@'@'@'@'@'@'@'@'@?(;2@?@?@?)(?)2(?(?(?@?(?@-@?@-@#$#$@$#$#@#@#@#@#@#$@$@$@$#$#@#@#@#@$#@#@#@#@#@$#$#$#$#$#$#$@#<$<$#<$<$#<$<$#<$<$#<$<$#$@+?(?(?(?(?;@(@(@(@(@(@(@(@'@(&@+@'?@'(+@=@'@-(@#$(&@+@;@-?-=-@-?-@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@<@?@?@?@?@?@?@-?@?@?@?@?@?@?>?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@+@'@'@'@'@'@'@'@2@2@(@4@4@";

// build/fable_modules/fable-library.3.7.17/Char.js
function getCategoryFunc() {
  const offset = 35;
  const a1 = [...rangeDeltas].map((ch) => {
    var _a;
    return ((_a = ch.codePointAt(0)) !== null && _a !== void 0 ? _a : 0) - offset;
  });
  const a2 = [...categories].map((ch) => {
    var _a;
    return ((_a = ch.codePointAt(0)) !== null && _a !== void 0 ? _a : 0) - offset;
  });
  const codepoints = new Uint32Array(a1);
  const categories2 = new Uint8Array(a2);
  for (let i = 1; i < codepoints.length; ++i) {
    codepoints[i] += codepoints[i - 1];
  }
  return (cp) => {
    let hi = codepoints.length;
    let lo = 0;
    while (hi - lo > 1) {
      const mid = Math.floor((hi + lo) / 2);
      const test = codepoints[mid];
      if (cp < test) {
        hi = mid;
      } else if (cp === test) {
        hi = lo = mid;
        break;
      } else if (test < cp) {
        lo = mid;
      }
    }
    return categories2[lo];
  };
}
var isControlMask = 1 << 14;
var isDigitMask = 1 << 8;
var isLetterMask = 0 | 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4;
var isLetterOrDigitMask = isLetterMask | isDigitMask;
var isUpperMask = 1 << 0;
var isLowerMask = 1 << 1;
var isNumberMask = 0 | 1 << 8 | 1 << 9 | 1 << 10;
var isPunctuationMask = 0 | 1 << 18 | 1 << 19 | 1 << 20 | 1 << 21 | 1 << 22 | 1 << 23 | 1 << 24;
var isSeparatorMask = 0 | 1 << 11 | 1 << 12 | 1 << 13;
var isSymbolMask = 0 | 1 << 25 | 1 << 26 | 1 << 27 | 1 << 28;
var isWhiteSpaceMask = 0 | 1 << 11 | 1 << 12 | 1 << 13;
var unicodeCategoryFunc = getCategoryFunc();
function charCodeAt(s, index) {
  if (index >= 0 && index < s.length) {
    return s.charCodeAt(index);
  } else {
    throw new Error("Index out of range.");
  }
}
var isUpper = (s) => isUpper2(s, 0);
function getUnicodeCategory2(s, index) {
  const cp = charCodeAt(s, index);
  return unicodeCategoryFunc(cp);
}
function isUpper2(s, index) {
  const test = 1 << getUnicodeCategory2(s, index);
  return (test & isUpperMask) !== 0;
}

// build/SettingTab.js
var obsidian2 = __toModule(require("obsidian"));
function System_String__String_camelcaseToHumanReadable_Static_Z721C83C5(str) {
  let source_1;
  return toString((source_1 = pairwise2(str.split("")), fold((sb, tupledArg) => {
    const c1 = tupledArg[0];
    const c2 = tupledArg[1];
    const up = isUpper;
    const matchValue = [up(c1), up(c2)];
    let pattern_matching_result;
    if (matchValue[0]) {
      pattern_matching_result = 1;
    } else if (matchValue[1]) {
      pattern_matching_result = 0;
    } else {
      pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
      case 0: {
        return StringBuilder__Append_Z721C83C5(sb, ` ${c2.toLocaleLowerCase()}`);
      }
      case 1: {
        return StringBuilder__Append_244C7CD6(sb, c2);
      }
    }
  }, StringBuilder_$ctor_Z721C83C5(`${str[0].toLocaleUpperCase()}`), source_1)));
}
function createSettingForProperty(plugin, settingTab, propName) {
  new obsidian2.Setting(settingTab.containerEl).setName(System_String__String_camelcaseToHumanReadable_Static_Z721C83C5(propName)).addText((txt) => {
    let arg_3;
    const property = find((f) => name(f) === propName, getRecordElements(PluginSettings$reflection()));
    arg_3 = getValue(property, plugin.settings), txt.setValue(arg_3);
    txt.onChange((value_1) => {
      plugin.settings = PluginSettingsModule_withDynamicProp(propName, value_1, plugin.settings);
      return void 0;
    });
    return void 0;
  });
}
function createSettingDisplay(plugin, settingtab, unitVar) {
  const containerEl = settingtab.containerEl;
  containerEl.empty();
  containerEl.createEl("h2", some(((arg) => arg)({
    text: "Quick snippets and navigation"
  })));
  const fields = getRecordElements(PluginSettings$reflection());
  const buildSetting = (propName) => {
    createSettingForProperty(plugin, settingtab, propName);
  };
  const array_1 = map2(name, fields);
  array_1.forEach(buildSetting);
  return void 0;
}
function create(app, plugin) {
  const settingtab = new obsidian2.PluginSettingTab(app, plugin);
  settingtab.display = () => createSettingDisplay(plugin, settingtab, void 0);
  settingtab.hide = (f) => {
    plugin.saveSettings(plugin.settings);
    return void 0;
  };
  return settingtab;
}

// build/Commands.js
var obsidian3 = __toModule(require("obsidian"));
function doNone(f) {
  return void 0;
}
function goToPrevHeading(plugin) {
  return Command_forEditor("goToPrevHeading", "Go to previous heading", uncurry(2, (editor) => {
    const cursor = editor.getCursor();
    const linesbefore = reverse(split(editor.getValue(), ["\n"], null, 0).slice(void 0, ~~cursor.line + 1));
    const foundOpt = tryFindIndex((f) => match(/^(#{1,6}) /gu, f) != null, Seq_skipSafe(1, linesbefore));
    if (foundOpt != null) {
      const moveby = foundOpt | 0;
      const newpos = ~~cursor.line - moveby - 1;
      editor.setCursor(newpos);
      return doNone;
    } else {
      return doNone;
    }
  }));
}
function goToNextHeading(plugin) {
  return Command_forEditor("goToNextHeading", "Go to next heading", uncurry(2, (editor) => {
    const cursor = editor.getCursor();
    const linesafter = split(editor.getValue(), ["\n"], null, 0).slice(~~cursor.line, split(editor.getValue(), ["\n"], null, 0).length);
    const foundOpt = tryFindIndex((f) => match(/^(#{1,6}) /gu, f) != null, Seq_skipSafe(1, linesafter));
    if (foundOpt != null) {
      const moveby = foundOpt | 0;
      const newpos = ~~cursor.line + moveby + 1;
      editor.setCursor(newpos);
      return doNone;
    } else {
      return doNone;
    }
  }));
}
function copyNextCodeBlock(plugin) {
  return Command_forEditor("copyNextCodeBlock", "Copy Next Code Block", uncurry(2, (edit) => {
    let arg_1, objectArg;
    const matchValue = Content_getCodeBlocks(plugin.app);
    if (matchValue != null) {
      const blocks = matchValue;
      const cursor = edit.getCursor();
      const _arg = tryFind((f_1) => f_1.startLine > ~~cursor.line, blocks);
      if (_arg != null) {
        const v = _arg;
        arg_1 = `copied:
${substring(v.content, 0, min(comparePrimitives, v.content.length, 50))}`, objectArg = obsidian3.Notice, new objectArg(arg_1);
        Clipboard_write(v.content);
      } else {
        new obsidian3.Notice("could not find a code block");
      }
      return doNone;
    } else {
      return doNone;
    }
  }));
}
function copyCodeBlock(plugin) {
  return Command_forMenu("copyCodeBlock", "Copy Code Block", () => {
    const codeblocks = Content_getCodeBlocks(plugin.app);
    if (codeblocks == null) {
      return void 0;
    } else {
      const codeblocks_1 = value(codeblocks);
      const modal = SuggestModal_withOnChooseSuggestion((f_3) => {
        let arg_2, objectArg;
        arg_2 = `copied:
${substring(f_3.content, 0, min(comparePrimitives, f_3.content.length, 50))}`, objectArg = obsidian3.Notice, new objectArg(arg_2);
        Clipboard_write(f_3.content);
      }, SuggestModal_withRenderSuggestion((f_2, elem) => {
        elem.innerText = f_2.content;
      }, SuggestModal_withGetSuggestions((queryInput) => {
        const query = obsidian3.prepareQuery(queryInput);
        const matches = map3((tuple) => tuple[0], where((f_1) => f_1[1] != null, map3((f) => {
          const text = f.content;
          return [f, obsidian3.fuzzySearch(query, text)];
        }, codeblocks_1)));
        return Array.from(matches);
      }, SuggestModal_create(plugin.app))));
      modal.open();
      return void 0;
    }
  });
}
function openSwitcherWithTag1(plugin) {
  return Command_forMenu("openSwitcherWithTag1", "Open Switcher with Tag 1", () => {
    let tags;
    const matchValue = Content_getTags(plugin.app);
    if (matchValue != null) {
      if (tags = matchValue, tags.length === 0) {
        const tags_1 = matchValue;
        Notice_show("no tags found");
      } else {
        const tags_2 = matchValue;
        const cmd = "obsidian-another-quick-switcher:search-command_Recent Search";
        plugin.app.commands.executeCommandById(cmd);
        const modalInput = document.querySelector("body > div.modal-container > div.prompt > input");
        modalInput.value = `${tags_2[0].tag} `;
        const ev = new Event("input", null);
        modalInput.dispatchEvent(ev);
      }
    } else {
      Notice_show("no tags found");
    }
    return void 0;
  });
}
function insertHeading4(plugin) {
  return Command_forEditor("insertHeading4", "Insert heading 4", uncurry(2, (edit) => {
    edit.replaceSelection("#### ");
    return doNone;
  }));
}
function insertDefaultCallout(plugin) {
  return Command_forEditor("insertDefaultCallout", "Insert Default Callout", uncurry(2, (edit) => {
    edit.replaceSelection(`> [!${plugin.settings.defaultCalloutType}] `);
    return doNone;
  }));
}
function insertCodeBlock(plugin) {
  return Command_forEditor("insertCodeBlock", "Insert Code Block", uncurry(2, (edit) => {
    edit.replaceSelection(`\`\`\`\`${plugin.settings.defaultCodeBlockLanguage}

\`\`\`\``);
    const cursor = edit.getCursor();
    edit.setCursor(cursor.line - 1);
    return doNone;
  }));
}

// build/Main.js
var Plugin2 = class extends import_obsidian.Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    const instance = new FSharpRef(null);
    this.app = app;
    instance.contents = this;
    this.plugin = instance.contents;
    Plugin2__init(this);
    this["init@15-1"] = 1;
    this.plugin.onload = () => {
      Plugin2__onload(this);
    };
  }
};
function Plugin2$reflection() {
  return class_type("Main.Plugin2", void 0, Plugin2, class_type("Main.BasePlugin", void 0, import_obsidian.Plugin));
}
function Plugin2_$ctor_Z7F5F6E8A(app, manifest) {
  return new Plugin2(app, manifest);
}
function Plugin2__init(this$) {
  this$.plugin.loadSettings = (_arg) => PromiseBuilder__Run_212F1D4B(promise, PromiseBuilder__Delay_62FBFDE1(promise, () => this$.plugin.loadData().then((_arg_1) => {
    const data = _arg_1;
    if (data != null) {
      const v = value(data);
      return PromiseBuilder__Delay_62FBFDE1(promise, () => {
        this$.plugin.settings = v;
        return Promise.resolve();
      }).catch((_arg_2) => {
        const e = _arg_2;
        this$.plugin.settings = PluginSettings_get_Default();
        return Promise.resolve();
      });
    } else {
      this$.plugin.settings = PluginSettings_get_Default();
      return Promise.resolve();
    }
  })));
  this$.plugin.saveSettings = (settings) => PromiseBuilder__Run_212F1D4B(promise, PromiseBuilder__Delay_62FBFDE1(promise, () => {
    this$.plugin.settings = settings;
    return this$.plugin.saveData(some(settings)).then(() => Promise.resolve(void 0));
  }));
}
function Plugin2__onload(this$) {
  this$.plugin.settings = this$.plugin.loadSettings();
  const arg = create(this$.app, this$.plugin);
  this$.plugin.addSettingTab(arg);
  iterate((cmd) => {
    let arg_1;
    arg_1 = cmd(this$.plugin), this$.plugin.addCommand(arg_1);
  }, [copyCodeBlock, copyNextCodeBlock, insertCodeBlock, goToPrevHeading, goToNextHeading, insertHeading4, insertDefaultCallout, openSwitcherWithTag1]);
}
module.exports = Plugin2;
