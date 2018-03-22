// @flow

import React from 'react';
import {TableBody, TableRow, TableCell, Typography} from 'material-ui';

type Props = {
  data: Array<any>,
  columnLength?: number,
  noDataPlaceholderText?: string,
  render: (datum: any, index: number) => ReactNode,
};

const NO_DATA_PLACEHOLDER_TEXT = 'No Data Available';

export default function TableBodyComponent(props: Props) {
  let {
    data,
    render,
    noDataPlaceholderText,
    columnLength,
    ...otherProps
  } = props;

  return (
    <TableBody {...otherProps}>
      {data.length === 0 && (
        <TableRow>
          <TableCell
            colSpan={columnLength || 1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
            }}
          >
            <Typography variant="subheading" style={{textAlign: 'center'}}>
              {noDataPlaceholderText || NO_DATA_PLACEHOLDER_TEXT}
            </Typography>
          </TableCell>
        </TableRow>
      )}
      {data.map((datum, index) => {
        return render(datum, index);
      })}
    </TableBody>
  );
}
