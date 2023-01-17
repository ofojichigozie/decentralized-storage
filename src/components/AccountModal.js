import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function AccountModal({
  accountModalState,
  address,
  disconnect,
  onHideAccountModal,
}) {
  return (
    <Modal show={accountModalState} onHide={onHideAccountModal}>
      <Modal.Header closeButton>
        <Modal.Title>Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{address}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={disconnect}>
          Disconnect
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
