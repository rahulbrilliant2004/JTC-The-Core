import React from 'react'
import {
  Button,
  Icon
} from 'material-ui';
import {Text} from 'react-native';
import {default as ExcelFile, ExcelSheet} from "react-data-export";

// this fucntion is to filter connote data
//s
const ExcelExportBtn = (props) => {
  let dataSet = [
    {
      columns: [props.title],
      data: []
    },
    {
      xSteps: 0, // Will start putting cell with 1 empty cell on left most
      ySteps: 1,
      columns: props.columns,
      data: props.data
    }
  ]
  return (
    <ExcelFile
      filename={props.filename}
      element={(<Button size="small">
        <Icon>insert_drive_file</Icon>
        <Text>Export</Text>
      </Button>)}
    >
        <ExcelSheet dataSet={dataSet} name={props.orgName} />
    </ExcelFile>
  )
}
export default ExcelExportBtn;