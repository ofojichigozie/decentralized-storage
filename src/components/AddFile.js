import React, { useState } from "react";

export default function AddFile({ uploadFile, captureFile }) {
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const handleSetFilename = (e) => {
    setName(e.target.value);
  };

  const handleSetDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      return;
    }
    uploadFile(name, description);
  };

  return (
    <div id="content" className="shadow p-4 mb-5 bg-white rounded mt-1">
      <h5 className="mb-3 text-primary">Store file</h5>
      <form onSubmit={handleFileUpload}>
        <div className="form-group">
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .bmp, .gif"
            onChange={captureFile}
          />
        </div>
        <div className="form-group">
          <input
            id="name"
            type="text"
            defaultValue={name}
            onChange={handleSetFilename}
            className="form-control mb-2"
            placeholder="File name..."
            required
          />
          <input
            id="file-description"
            type="text"
            defaultValue={description}
            onChange={handleSetDescription}
            className="form-control"
            placeholder="File description..."
            required
          />
        </div>
        <div className="form-group d-flex justify-content-end">
          <button type="submit" className="btn btn-primary btn-lg">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
