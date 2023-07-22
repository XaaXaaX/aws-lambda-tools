/**
 * @remarks
 * This function removes all elements in json object with null, undefined or NaN value.
 *
 * @param key
 * @param value
 */
export function NullElementsReplacer(key: any, value: any) {
  if (key && isNullElement(value)) {
    return void 0;
  }
  return value;
}

export function isNullElement(value: any): boolean {
  return (value === null || value === undefined || Number.isNaN(value) || (value.constructor === Object && Object.keys(value).length == 0));
}

export function CleanAndStringify(source: any) {
  return JSON.stringify(source, NullElementsReplacer, 2);
}

export function RemoveEmptyObjects(source: any) {
  for (var key in source) {
    if (!source[key] || source[key].constructor !== Object ) {
      if (isNullElement(source[key])) {
        delete source[key]; //Delete null Properties
      }
      continue;
    }

    // The property is an object
    RemoveEmptyObjects(source[key]); // <-- Make a recursive call on the nested object
    if (Object.keys(source[key]).length === 0) {
      delete source[key]; // The object had no properties, so delete that property
    }
  }
  return source;
}

export function DeCamelizeKeys(source: any) {
  for (var key in source) {
    //Camelize keys
    const newKey = key.charAt(0).toUpperCase() + key.substring(1);
    if( !source[newKey] ) {
      source[newKey] = source[key];
      delete source[key];
    }
    if (!source[newKey] || typeof source[newKey] !== "object") {
      continue;
    }
    DeCamelizeKeys(source[newKey]);
  }
  return source;
}

export function CamelizeKeys(source: any) {
  for (var key in source) {
    //Camelize keys
    const newKey = key.charAt(0).toLowerCase() + key.substring(1);
    if( !source[newKey] ) {
      source[newKey] = source[key];
      delete source[key];
    }
    if (!source[newKey] || typeof source[newKey] !== "object") {
      continue;
    }
    CamelizeKeys(source[newKey]);
  }
  return source;
}