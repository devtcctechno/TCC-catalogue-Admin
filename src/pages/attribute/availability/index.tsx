/* eslint-disable lines-around-comment */
// ** MUI Imports

import MasterComponent from 'src/customComponents/MasterComponents'
import { MasterType } from 'src/data/enum'

const Availability = () => {
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
            Title='Availability'
            EditorField={true}
            MasterType={MasterType.Availability}
            ColumnData={column}
            AddImage={false}
            SortCodeField={true}
            DropDown={false}
            DropDownLabelName=''
        />
    )
}

export default Availability
