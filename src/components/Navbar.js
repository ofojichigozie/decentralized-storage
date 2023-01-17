import React from "react";

export default function Navbar({ address, connect, onShowAccountModal }) {
  const shortenAddress = (address) => {
    if (!address) return "";
    return address
      .slice(0, 5)
      .concat("...")
      .concat(address.slice(address.length - 4));
  };

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-3 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Destorage
      </a>
      <ul className="navbar-nav px-3">
        {!address ? (
          <li className="nav-item active">
            <button className="btn btn-success" onClick={connect}>
              Connect
            </button>
          </li>
        ) : (
          <li className="nav-item active">
            <button
              className="btn btn-danger"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={onShowAccountModal}
            >
              {shortenAddress(address)}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
