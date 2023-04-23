import { useState, useCallback, useEffect, useRef } from 'react';
import { IDriver, IRider } from '../types';

const Table = ({
  headers,
  minCellWidth,
  tableContent,
}: {
  headers: string[];
  minCellWidth: number;
  tableContent: IDriver | IRider | null;
}) => {
  const [tableHeight, setTableHeight] = useState('auto');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableElement = useRef(null);

  const mkHeaders = () => {
    return (
      <thead>
        <tr>
          {headers.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
    );
  };

  return (
    <>
      <table className="resizeable-table" ref={tableElement}>
        {mkHeaders}
        {tableContent}
      </table>
    </>
  );
};

export default Table;
