/* eslint-disable lines-around-comment */
// ** MUI Imports

import MasterComponent from 'src/customComponents/MasterComponents'
import { MasterType } from 'src/data/enum'

const Tags = () => {
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
    }
  ]

  return (
    <MasterComponent
      Title='City'
      EditorField={true}
      MasterType={MasterType.city}
      ColumnData={column}
      AddImage={false}
      SortCodeField={true}
      DropDown={false}
      DropDownLabelName=''
    />
  )
}

export default Tags
