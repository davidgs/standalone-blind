/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationOctagon } from 'react-bootstrap-icons';

export default function DireWarning({
  show,
  warning,
  onConfirm,
}: {
  show: boolean;
  warning: string;
  // eslint-disable-next-line no-unused-vars
  onConfirm: (value: boolean) => void;
}): React.JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  useEffect(() => {
    setShowConfig(show);
  }, [show]);

  const handleConfirm = () => {
    setShowConfig(false);
    onConfirm(true);
  };

  const handleClose = () => {
    setShowConfig(false);
    onConfirm(false);
  };

  return (
    <Modal show={showConfig} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 style={{ color: 'red', textAlign: 'center' }}>
            <ExclamationOctagon /> Warning
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: 'center' }}>
          <h2>{warning}</h2>
          <br />
          <h3>Are you sure you want to continue?</h3>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DireWarning.propTypes = {
  show: PropTypes.bool.isRequired,
  warning: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
