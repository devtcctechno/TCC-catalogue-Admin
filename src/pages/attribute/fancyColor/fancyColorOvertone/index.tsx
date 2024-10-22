/* eslint-disable lines-around-comment */
// ** MUI Imports

import MasterComponent from 'src/customComponents/MasterComponents'
import { MasterType } from 'src/data/enum'

const fancyColorOvertone = () => {
  const column = [
    {
      flex: 1,
      value: 'name',
      headerName: 'name',
      field: 'name',
      text: 'text'
    },
    {
      flex: 1,
      value: 'sort_code',
      headerName: 'code',
      field: 'sort_code',
      text: 'text'
    },
    {
      flex: 1,
      value: 'slug',
      headerName: 'slug',
      field: 'slug',
      text: 'text'
    }
  ]

  return (
    <MasterComponent
      Title='Fancy Color Overtone'
      EditorField={true}
      MasterType={MasterType.fancyColorOvertone}
      ColumnData={column}
      AddImage={false}
      SortCodeField={true}
      DropDown={false}
      DropDownLabelName=''
    />
  )
}

export default fancyColorOvertone
