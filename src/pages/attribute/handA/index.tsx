/* eslint-disable lines-around-comment */
// ** MUI Imports

import MasterComponent from 'src/customComponents/MasterComponents'
import { MasterType } from 'src/data/enum'

const handa = () => {
  const column = [
    {
      flex: 1,
      headerName: 'image',
      field: 'image_path',
      avatars: 'avatars',
      value: 'image_path'
    },
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
      Title='H & A'
      EditorField={true}
      MasterType={MasterType.HandA}
      ColumnData={column}
      AddImage={true}
      SortCodeField={true}
      DropDown={false}
      DropDownLabelName=''
    />
  )
}

export default handa
