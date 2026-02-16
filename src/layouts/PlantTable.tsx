import React, { memo, useEffect, useRef, useState } from 'react';
import { Grid } from 'gridjs-react';
import { _ } from "gridjs-react";

import { MdFullscreen } from "react-icons/md";
import { Box, Icon } from '@chakra-ui/react';

interface APIData {
  column: string[] | ['Name', 'Type', 'Capacities', 'Country', 'PV Power', 'Irr', 'Energy Today', 'PRV'];
  dataFromAPI: string[][];
}

interface PlantTableProps {
  mt?: number | string;
  pagination?: boolean;
  paginationLimitProps?: number;
  search?: boolean;
  apiData?: APIData[];
  column?: string[] | any[];  // column={[{name : "Name", formatter: (cell : any, row: any) => html(`<b style="padding: 4px; border-left:3px solid ${parseFloat(row.cells[4].data) > 1 ? 'green' : 'red'};" >${cell}</b>`)}, 'Type', 'Capacities', 'Country', 'PV Power', 'Irr', 'Energy Today', 'PRV']}
  width?: string;
  autoWidth?: boolean;
  sort?: boolean;
  fullScreen?: boolean;    // This is for only table Full Screen
  isFullscreen?: boolean;    // This is For Widget full screen. IT IS AUTOMATICALLY SET THROUGH LAYOUT.
  customColumn?: boolean;
  customColumnCount?: number;
}

const PlantTable: React.FC<PlantTableProps> = ({
  mt = 0,
  pagination = true,
  paginationLimitProps = 5,
  search = true,
  apiData,
  column,
  width,
  autoWidth = false,
  sort = true,
  fullScreen = true,
  isFullscreen = false,
  customColumn = false,
  customColumnCount = 7,
}) => {
  var data = [
    ["", "", "", "", "", "", "", "", "", "", "", ""]
    // ['Plant Name', 'PV', '900', 'Vienna', '2,675.7', '259.10', 'Col Name', '3478'],
  ];
  var colData = ['Name', 'Type', 'Capacities', 'Country', 'PV Power', 'Irradiation', 'Energy Today', 'PRV'];
  if (!apiData) {
    apiData = [{ column: colData, dataFromAPI: data }];
  }

  const tableRef = useRef(null);
  const [paginationLimit, setPaginationLimit] = useState<number>(paginationLimitProps);

  const handleFullScreen = () => {
    if (tableRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        (tableRef.current as HTMLElement)?.requestFullscreen();
        setPaginationLimit(20); // Increase pagination limit in fullscreen mode
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPaginationLimit(paginationLimitProps);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [paginationLimitProps]);

  let changeCol = [] as any[];

  if (customColumn) {
    if (isFullscreen) {
      changeCol = column?.slice(0, column.length) || colData;
    } else {
      changeCol = column?.slice(0, customColumnCount) || colData;
    }
  } else {
    changeCol = column || apiData[0].column;
  }

  useEffect(() => {
    if (isFullscreen) {
      setPaginationLimit(15); // Increase pagination limit in fullscreen mode
    } else {
      setPaginationLimit(paginationLimitProps); // Decrease pagination limit in Default Screen mode
    }
  }, [isFullscreen]);

  // Function to add blank rows
  const getAdjustedData = (data: string[][], paginationLimit: number): string[][] => {
    const rowCount = data.length;
    const colCount = column?.length || 0; // Number of columns in the table
    const blankRowsNeeded = paginationLimit - rowCount;

    if (blankRowsNeeded > 0) {
      const blankRows = Array.from({ length: blankRowsNeeded }, () =>
        Array(colCount).fill("") // Fill all columns with empty strings
      );
      return [...data, ...blankRows];
    }

    return data;
  };

  const adjustedData = getAdjustedData(
    apiData && apiData[0]?.dataFromAPI ? apiData[0].dataFromAPI : data,
    paginationLimit
  );

  return (
    <Box ref={tableRef} className="plant-table-container" mt={mt}>
      <Grid
        columns={changeCol ? changeCol : apiData[0].column}
        data={adjustedData} // Use the adjusted data here
        search={isFullscreen ? search : false}
        sort={sort}
        width={width || 'max-content'}
        pagination={pagination && {
          limit: paginationLimit,
          summary: false,
        }}
        autoWidth={autoWidth}
        className={{
          table: 'plant-table',
          thead: 'gridjs-thead',
          th: 'gridjs-th',
          tr: 'gridjs-tr',
          td: 'gridjs-td',
          pagination: 'gridjs-pagination',
          paginationButtonPrev: 'gridjs-pagination__prev',
          paginationButtonNext: 'gridjs-pagination__next',
          error: 'gridjs-error',
        }}
      />
      {/* {fullScreen && <Icon 
        as={MdFullscreen}
        boxSize={5} 
        float={"right"} 
        pos={"relative"} 
        bottom={"32px"} 
        onClick={handleFullScreen}
        _fullScreen={{
          bottom : "35px"
        }}
        cursor={"pointer"}
        />} */}
    </Box>
  );
};

export default PlantTable;