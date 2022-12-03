type Function = (...args: any[]) => unknown

export const stringify = (func: Function): string => func.toString()

export const parse = (raw: string): Function => {
  return new Function('return ' + raw)()
}
