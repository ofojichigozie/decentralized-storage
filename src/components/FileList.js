import React from "react";

export default function FileList({ files }) {
  if (!files || files.length === 0) {
    return <p className="text-center">You've not upload any file yet!</p>;
  }

  return (
    <div className="row mt-4">
      {files.map((file, key) => {
        return (
          <div className="col-md-6" key={key}>
            <div className="card mb-4 pt-2">
              <ul id="imageList" className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-center">
                  <a
                    href={file.cid}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to view file"
                    style={{ textDecoration: "none" }}
                  >
                    <p
                      className="d-flex justify-content-center align-items-center flex-column"
                      style={{
                        fontSize: "3rem",
                        fontWeight: "bold",
                        height: "200px",
                        width: "200px",
                        color: "white",
                        backgroundColor: "rgb(207, 207, 207)",
                        borderRadius: "50%",
                      }}
                    >
                      {file.type}
                      <small
                        className="text-dark text-center"
                        style={{ fontSize: "12pt", fontWeight: "bold" }}
                      >
                        {file.name}
                      </small>
                    </p>
                  </a>
                </li>
                <li className="list-group-item py-2">
                  <small className="d-block mt-1 text-dark">
                    {file.description}
                  </small>
                  <small className="d-block mt-1 text-danger">
                    {file.timestamp}
                  </small>
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
