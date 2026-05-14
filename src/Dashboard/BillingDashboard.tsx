import React from "react";
import {
  Box,
  Input,
  Button,
  HStack,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";

const BillingDashboard = () => {
  const [data, setData] = React.useState<any[]>([]);

  //  NEW: FILTER TYPE (day / month)
  const [filterType, setFilterType] = React.useState<"day" | "month">("day");

  const [date, setDate] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);

  const [sortBy, setSortBy] = React.useState("invoice_no");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const bg = useColorModeValue("#f4f6f9", "#1a202c");
  const cardBg = useColorModeValue("#ffffff", "#2d3748");
  const headerBg = useColorModeValue("#f1f3f4", "#2d3748");
  const textColor = useColorModeValue("#333", "#e2e8f0");
  const subText = useColorModeValue("#555", "#a0aec0");
  const borderColor = useColorModeValue("#eee", "#4a5568");

  const formatValue = (val: any) => {
    if (val === null || val === undefined || Number(val) === 0) {
      //  dummy value (same type as UI)
      return "0.000000";
    }

    //  number format (6 decimal like image)
    return Number(val).toFixed(6);
  };

  const fetchInvoices = (
    pageNo = page,
    limitNo = limit
  ) => {
    let url = `http://75.119.146.115:5179/api/invoices?page=${pageNo}&limit=${limitNo}&filterType=${filterType}`;

    // DAY FILTER
    if (filterType === "day" && date) {
      url += `&date=${date}`;
    }

    // MONTH FILTER
    if (filterType === "month" && month && year) {
      url += `&month=${month}&year=${year}`;
    }

    url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setTotalPages(res.pagination.total_pages);
          setPage(res.pagination.page);
        }
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    fetchInvoices();
  }, [limit]);

  React.useEffect(() => {
    // dropdown change pe sirf folder ka data load
    setPage(1);

    let url = `http://75.119.146.115:5179/api/invoices?page=1&limit=${limit}&filterType=${filterType}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setTotalPages(res.pagination.total_pages);
          setPage(res.pagination.page);
        }
      });
  }, [filterType]);

  return (
    <Box bg={bg} p={5} minH="100vh">
      <Box fontWeight="600" mb={3} color={textColor}>
        Invoice List
      </Box>

      {/* FILTER SECTION */}
      <HStack spacing={2} mb={3} flexWrap="wrap">

        {/* DAY / MONTH DROPDOWN */}
        <Select
          size="sm"
          w="120px"
          value={filterType}
          onChange={(e) => {
            const val = e.target.value as "day" | "month";
            setFilterType(val);

            // reset values
            setDate("");
            setMonth("");
            setYear("");
          }}
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
        </Select>

        {/* DAY FILTER */}
        {filterType === "day" && (
          <Input
            type="date"
            size="sm"
            w="150px"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        )}

        {/* MONTH FILTER */}
        {filterType === "month" && (
          <>
            <Select
              placeholder="Select month"
              size="sm"
              w="120px"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Year"
              size="sm"
              w="100px"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </>
        )}

        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            setPage(1);
            fetchInvoices(1);
          }}
        >
          Generate
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            // 🔁 reset all states
            setDate("");
            setMonth("");
            setYear("");
            setFilterType("day");
            setPage(1);

            //  FORCE CLEAN FETCH (no filters)
            let url = `http://75.119.146.115:5179/api/invoices?page=1&limit=${limit}&filterType=day&sortBy=${sortBy}&sortOrder=${sortOrder}`;

            fetch(url)
              .then((res) => res.json())
              .then((res) => {
                if (res.success) {
                  setData(res.data);
                  setTotalPages(res.pagination.total_pages);
                  setPage(res.pagination.page);
                }
              });
          }}
        >
          Reset
        </Button>
      </HStack>

      {/* TABLE */}
      <Box bg={cardBg} borderRadius="6px" overflow="hidden">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: headerBg, textAlign: "left" }}>

              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                S.No.
              </th>

              {/* UPDATED SORT HEADER */}
              <th
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  color: subText,
                  cursor: "pointer",
                }}
                onClick={() => {
                  const newOrder = sortOrder === "asc" ? "desc" : "asc";
                  setSortOrder(newOrder);
                  setSortBy("invoice_no");
                  setPage(1);

                  setTimeout(() => fetchInvoices(1), 0);
                }}
              >
                Invoice No.{" "}
                {sortBy === "invoice_no"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                Month / Year
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                Generated By
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                Invoice Date
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                NEEDs
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                NEEDs Charges
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                DEEDs
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                DEEDs Charges
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                EBC
              </th>
              <th style={{ padding: "10px", fontSize: "12px", color: subText }}>
                View
              </th>
            </tr>
          </thead>

<tbody>
  {data.length === 0 ? (
    <tr>
      <td colSpan={11} style={{ textAlign: "center", padding: "20px", color: textColor }}>
        No Data Found
      </td>
    </tr>
  ) : (
    data.map((row, i) => {
      const dateObj = new Date(row.created_at);

      return (
        <tr
          key={i}
          style={{
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <td style={{ padding: "10px", color: textColor }}>{row.s_no}</td>

          <td style={{ padding: "10px", color: textColor }}>
            {row.invoice_no}
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            {dateObj.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            admin@admin.com
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            {dateObj.toLocaleString()}
          </td>

          {/* NEW COLUMNS */}
          <td style={{ padding: "10px", color: textColor }}>
            {formatValue(row.needs)}
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            {formatValue(row.needs_charges)}
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            {formatValue(row.deeds)}
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            {formatValue(row.deeds_charges)}
          </td>

          <td style={{ padding: "10px", color: textColor }}>
            {formatValue(row.ebc)}
          </td>

          <td style={{ padding: "10px" }}>
            <a
              href={`http://75.119.146.115:5179/api/invoices/files/${row.file_name}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#3182ce", fontWeight: 500 }}
            >
              View
            </a>
          </td>
        </tr>
      );
    })
  )}
</tbody>
        </table>

        {/* PAGINATION */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
          borderTop={`1px solid ${borderColor}`}
        >
          <HStack>
            <Box fontSize="13px" color={textColor}>
              Rows per page:
            </Box>
            <Select
              size="sm"
              w="70px"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
          </HStack>

          <HStack>
            <Button
              size="xs"
              onClick={() => fetchInvoices(page - 1)}
              isDisabled={page === 1}
            >
              ◀
            </Button>

            <Box fontSize="13px" color={textColor}>
              Page {page} of {totalPages}
            </Box>

            <Button
              size="xs"
              onClick={() => fetchInvoices(page + 1)}
              isDisabled={page === totalPages}
            >
              ▶
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingDashboard;