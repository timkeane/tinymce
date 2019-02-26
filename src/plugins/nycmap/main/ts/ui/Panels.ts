import start from './StartPanel'
import search from './SearchPanel'
import geoclient from './GeoclientPanel'
import data from './DataPanel'
import csv from './CsvPanel'
import socrata from './SocrataPanel'
import columns from './ColumnsPanel'
import presentation from './PresentationPanel'
import icon from './IconPanel'
import circle from './CirclePanel'
import style from './StylePanel'

export default {
  start: start,
  search: search,
  geoclient: geoclient,
  data: data,
  csv: csv,
  socrata: socrata,
  columns: columns,
  presentation: presentation,
  icon: icon,
  circle: circle,
  style: style,
  panels: [
    start,
    search,
    geoclient,
    data,
    csv,
    socrata,
    columns,
    presentation,
    icon,
    circle,
    style
  ]
};