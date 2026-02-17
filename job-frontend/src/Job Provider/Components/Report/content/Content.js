import React, { useState, useEffect } from "react";
import {
  FormGroup,
  FormControl,
  Col,
  Row,
  Table,
  Container,
  FormLabel,
} from "react-bootstrap";
import classes from "./Content.module.css";
import useTable from "../../../../hooks/useTable";
import TableFooter from "../../../../components/dashboard/Tables/TableFooter";
import { CSVLink } from "react-csv";
import axios from "axios";
import Config from "../../../../config/Config.json";

function Reports() {
  const [reportsData, setReportsData] = useState([]);
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(reportsData, page, 5);

  const [forminputs, setFormInputs] = useState({
    startdate: "",
    enddate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTd = async () => {
      try {
        const res = await axios.get(
          `${Config.SERVER_URL}provider/jobs/`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setReportsData(res.data.jobs || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTd();
  }, []);

  const validateStart = () => {
    let error = "";
    if (!forminputs.startdate && forminputs.enddate) {
      error = "please enter start date";
    }
    setErrors((values) => ({ ...values, startdate: error }));
  };

  const validateEnd = () => {
    let error = "";
    if (!forminputs.enddate && forminputs.startdate) {
      error = "please enter end date";
    } else if (forminputs.enddate && forminputs.startdate) {
      let startdate = new Date(forminputs.startdate);
      let enddate = new Date(forminputs.enddate);
      if (startdate > enddate) {
        error = "end date should be greater than start date";
      }
    }
    setErrors((values) => ({ ...values, enddate: error }));
  };

  const validate = () => {
    validateStart();
    validateEnd();
    return !errors.startdate && !errors.enddate;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (!forminputs.startdate || !forminputs.enddate) return;

    let stdate = new Date(forminputs.startdate);
    let endate = new Date(forminputs.enddate);

    const newData = reportsData.filter((report) => {
      let date = new Date(report.startDate);
      return date >= stdate && date <= endate; // ✅ Proper return
    });

    setReportsData(newData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  const headers = [
    { label: "JobId", key: "jobId" },
    { label: "ProviderId", key: "providerId" },
    { label: "Title", key: "title" },
    { label: "StartDate", key: "startDate" },
    { label: "EndDate", key: "endDate" },
  ];

  const csvLink = {
    headers: headers,
    data: reportsData,
    filename: "csvfile.csv",
  };

  return (
    <Container>
      <Row className={classes.rowStyle}>
        <Col className={`${classes.repo} col-md-3`}>
          <span className={classes.span11}>Reports</span>
        </Col>
      </Row>

      <Row className={classes.filters}>
        <Col className={classes.str1}>
          <FormGroup>
            <Row>
              <Col>
                <FormLabel className={classes.textstyl}>
                  <b>StartDate</b>
                </FormLabel>
              </Col>
              <Col className={classes.input}>
                <FormControl
                  onBlur={validateStart}
                  onChange={handleChange}
                  name="startdate"
                  type="date"
                />
                <div className="text-danger text-center">
                  {errors.startdate}
                </div>
              </Col>
            </Row>
          </FormGroup>
        </Col>

        <Col className={classes.end1}>
          <FormGroup>
            <Row>
              <Col>
                <FormLabel className={classes.textstyl}>
                  <b>EndDate</b>
                </FormLabel>
              </Col>
              <Col className={classes.input}>
                <FormControl
                  onBlur={validateEnd}
                  onChange={handleChange}
                  name="enddate"
                  type="date"
                />
                <div className="text-danger text-center">
                  {errors.enddate}
                </div>
              </Col>
            </Row>
          </FormGroup>
        </Col>

        <Col className={classes.actions}>
          <button className={classes.buttonsty} onClick={handleSubmit}>
            Submit
          </button>

          <button className={classes.csvsty}>
            <CSVLink className={classes.sty11} {...csvLink}>
              Export to CSV
            </CSVLink>
          </button>
        </Col>
      </Row>

      <div className={classes.tableBox}>
        <Table striped hover>
          <thead>
            <tr className={classes.tableHeader}>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>StartDate</th>
              <th>EndDate</th>
            </tr>
          </thead>
          <tbody className={classes.tableBody}>
            {slice.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.title}</td>
                <td>{contact.description}</td>
                <td>{contact.category}</td>
                <td>{contact.startDate}</td>
                <td>{contact.endDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <TableFooter
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
      />
    </Container>
  );
}

export default Reports;
