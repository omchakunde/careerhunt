import "./Content.css";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import classes from "./Content1.module.css";

const dateFilterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    if (!cellValue) return -1;

    const dateParts = cellValue.split("-");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) return 0;
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;

    return 0;
  },
  browserDatePicker: true,
};

function Content1() {
  const [gridApi, setGridApi] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rowData = [
    {
      jobid: 12134,
      jobtitle: "Software",
      username: "Sarath",
      date: "09-02-2022",
      emailid: "sarath@gmail.com",
    },
    {
      jobid: 12135,
      jobtitle: "Software",
      username: "Praveen",
      date: "19-02-2022",
      emailid: "Praveen@gmail.com",
    },
    {
      jobid: 12136,
      jobtitle: "Software",
      username: "Nivetha",
      date: "01-03-2022",
      emailid: "Nivetha@gmail.com",
    },
    {
      jobid: 12137,
      jobtitle: "Software",
      username: "Charan",
      date: "10-03-2022",
      emailid: "Charan@gmail.com",
    },
    {
      jobid: 12138,
      jobtitle: "Software",
      username: "Hari",
      date: "25-03-2022",
      emailid: "Hari@gmail.com",
    },
  ];

  const columns = [
    { headerName: "JobId", field: "jobid" },
    { headerName: "UserName", field: "username" },
    { headerName: "JobTitle", field: "jobtitle" },
    { headerName: "EmailId", field: "emailid" },
    {
      headerName: "Date",
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
  ];

  const defColumnDefs = { flex: 1 };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const getFilterType = () => {
    if (startDate && endDate) return "inRange";
    if (startDate) return "greaterThan";
    if (endDate) return "lessThan";
    return null;
  };

  useEffect(() => {
    if (!gridApi) return;

    if (startDate && endDate && startDate > endDate) return;

    const dateFilterComponent = gridApi.getFilterInstance("date");

    if (dateFilterComponent) {
      dateFilterComponent.setModel({
        type: getFilterType(),
        dateFrom: startDate || endDate,
        dateTo: endDate || null,
      });

      gridApi.onFilterChanged();
    }
  }, [startDate, endDate, gridApi]); // ✅ gridApi added

  const Jobs = rowData.map((job) => ({
    JobId: job.jobid,
    UserName: job.username,
    JobTitle: job.jobtitle,
    EmailId: job.emailid,
  }));

  const headers = [
    { label: "JobId", key: "JobId" },
    { label: "UserName", key: "UserName" },
    { label: "JobTitle", key: "JobTitle" },
    { label: "EmailId", key: "EmailId" },
  ];

  const csvLink = {
    headers,
    data: Jobs,
    filename: "csvfile.csv",
  };

  return (
    <Container>
      <Row>
        <Col>
          <span className={`${classes.span1} float-start`}>Reports</span>
        </Col>
      </Row>

      <div className="ag-theme-alpine" style={{ height: 300 }}>
        <Row>
          <Col className={classes.design}>
            <span className={`${classes.fstyle} float-start`}>
              Start Date
            </span>

            <input
              className={`${classes.aligningst} float-start`}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <span className={`${classes.fstyle} float-start`}>
              End Date
            </span>

            <input
              className={`${classes.aligningst} float-start`}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <Button className={`${classes.btnstyle} bg-primary float-end`}>
              <CSVLink className={classes.sty11} {...csvLink}>
                Export to CSV
              </CSVLink>
            </Button>
          </Col>
        </Row>

        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          onGridReady={onGridReady}
        />
      </div>
    </Container>
  );
}

export default Content1;
