import { Card } from "react-bootstrap";
import classes from "./Modalf.module.css";
import Config from "../../config/Config.json";

function Jobitem({ item, jobApply }) {

  const jobApplyHandler = () => {
    if (jobApply) {
      jobApply(item);
    }
  };

  return (
    <div className="grid grid-col-4 gap-4">
      <Card className={classes.cardstyle}>
        <Card.Body>

          <div className={classes.imgstyle}>
            <img
              src={
                item.companyLogo
                  ? `${Config.SERVER_URL}uploads/${item.companyLogo}`
                  : "https://source.unsplash.com/random/200x100?office"
              }
              alt={item.title}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "5px"
              }}
            />
          </div>

          <Card.Title>{item.title}</Card.Title>

          <Card.Text>
            <div className={classes.style}>
              {item.description}
            </div>
          </Card.Text>

          <div className={classes.badge}>
            <span className="badge bg-primary">Full time</span>
            <span className="badge bg-primary" style={{ marginLeft: "13px" }}>
              Min.1 Year
            </span>
            <span className="badge bg-primary" style={{ marginLeft: "10px" }}>
              Senior Level
            </span>
          </div>

          {jobApply && (
            <button
              type="button"
              style={{ marginTop: "30px", paddingBottom: "10px" }}
              onClick={jobApplyHandler}
              className="btn btn-primary"
            >
              Apply Now
            </button>
          )}

        </Card.Body>
      </Card>
    </div>
  );
}

export default Jobitem;
