const listOfStringsInArray = (array, and="and") => {
  if (array.length === 0 ) return ''
  if (array.length === 1)  return array[0]
  if (array.length === 2)  return array[array.length - 2] + ' ' + and + ' ' + array[array.length - 1]
  return array.slice(0, array.length - 2).join(', ') + ', ' + array[array.length - 2] + ' ' + and + ' ' + array[array.length - 1]
}

export { listOfStringsInArray }
