// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  commonSenseSplit(separator: string): string[]
}

String.prototype.commonSenseSplit = function (separator) {
  return this.trim()
    .split(separator)
    .filter((s) => s !== "")
    .map((s) => s.trim())
}
