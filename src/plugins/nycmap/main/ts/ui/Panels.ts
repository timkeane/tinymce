import style from './StylePanel'
import search from './SearchPanel'
import geoclient from './GeoclientPanel'
import data from './DataPanel'
import csv from './CsvPanel'
import socrata from './SocrataPanel'
import columns from './ColumnsPanel'
import presentation from './PresentationPanel'
import icon from './IconPanel'
import circle from './CirclePanel'
import start from './StartPanel'

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