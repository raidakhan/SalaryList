import * as React from "react";
import {
  take,
  sort,
  prop,
  ascend,
  descend,
  toUpper,
  pipe,
  toString
} from "ramda";
import { AutoSizer, Column, Table, SortDirectionType } from "react-virtualized";
import "react-virtualized/styles.css";

import { Row } from "./App";
import TableRow from "./TableRow";
// import sortBy from "ramda/es/sortBy";

// table takes sortkey and sorts itself
type Props = {
  items: [Row];
};

type State = {
  items: [Row];
  sortKey: string;
  sortDirection: SortDirectionType;
};

const getCurrencyString = (n: number) => {
  return `$${n.toLocaleString()}`;
};

// const getSortButton = (
//   sortKey,
//   currentSortKey,
//   currentSortDirection,
//   onClick
// ) => (
//   <input
//     type="button"
//     onClick={() => onClick(sortKey)}
//     value={`${sortKey}${
//       sortKey == currentSortKey ? (currentSortDirection > 0 ? " ▲" : " ▼") : ""
//     }`}
//   />
// );

interface ISortFnProps {
  defaultSortDirection: string;
  event: any;
  sortBy: string;
  sortDirection: string;
}

class SalaryTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      sortKey: "lastName",
      sortDirection: "ASC"
    };
    this._sortList = this._sortList.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.setState({
        items: nextProps.items
      });
    } 
  }
  _headerRenderer({ dataKey, label, sortBy, sortDirection }) {
    return (
      <span>
        {`${label}${dataKey == sortBy ? (sortDirection === "ASC" ? " ▲" : " ▼") : ""}`}
      </span>
    );
  }
  _sortList({ sortBy, sortDirection }: {sortBy: string; sortDirection: SortDirectionType}): void {
    const { items } = this.state;
    const dir = sortDirection === "ASC" ? ascend : descend;
    console.log('sortList', sortDirection);
    const sortedList = sort(
      dir(
        pipe(
          prop(sortBy),
          val => (typeof val == "number" ? val : toUpper(val))
        )
      ),
      items
    ) as [Row];
    this.setState({
      items: sortedList,
      sortKey: sortBy,
      sortDirection,
    });
  }
  render() {
    const { sortKey, sortDirection, items } = this.state;
    console.log('render', sortDirection);
    const visible = items;
    return items ? (
      <div style={{ flex: "auto" }}>
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={width}
              height={height}
              headerHeight={20}
              rowHeight={30}
              rowCount={visible.length}
              rowGetter={({ index }) => visible[index]}
              sort={this._sortList}
              sortBy={sortKey}
              sortDirection={sortDirection}
            >
              <Column
                flexShrink={0}
                headerRenderer={this._headerRenderer}
                label="First Name"
                dataKey="firstName"
                width={150}
              />
              <Column
                flexShrink={0}
                headerRenderer={this._headerRenderer}
                label="Last Name"
                dataKey="lastName"
                width={150}
              />
              <Column
                flexGrow={1}
                headerRenderer={this._headerRenderer}
                label="Job Description"
                dataKey="jobDescription"
                width={300}
              />
              <Column
                flexShrink={0}
                headerRenderer={this._headerRenderer}
                label="Salary"
                dataKey="salary"
                width={100}
                cellDataGetter={({ dataKey, rowData }) =>
                  getCurrencyString(rowData[dataKey])
                }
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    ) : (
      "loading row data"
    );
    // return (
    //   <div className="sortable-table">
    //     <div>
    //       {getSortButton("firstName", sortKey, sortDirection, this._sortBy)}
    //       {getSortButton("lastName", sortKey, sortDirection, this._sortBy)}
    //       {getSortButton("salary", sortKey, sortDirection, this._sortBy)}
    //     </div>
    //     {items
    //       ? this._getSortedList().map(item => (
    //           <TableRow key={item.key} row={item} />
    //         ))
    //       : "loading"}
    //   </div>
    // );
  }
}

export default SalaryTable;
