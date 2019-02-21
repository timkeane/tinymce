import style from './style.js'
import search from './search.js'
import geoclient from './geoclient.js'
import data from './data.js'
import csv from './csv.js'
import socrata from './socrata.js'
import columns from './columns.js'
import presentation from './presentation.js'
import icon from './icon.js'
import circle from './circle.js'
import start from './start.js'

export default {
  style: style,
  search: search,
  geoclient: geoclient,
  data: data,
  csv: csv,
  socrata: socrata,
  columns: columns,
  presentation: presentation,
  icon: icon,
  circle: circle,
  start: start,
  panels: [
    style,
    search,
    geoclient,
    data,
    csv,
    socrata,
    columns,
    presentation,
    icon,
    circle,
    start
  ]
};