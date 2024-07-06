/*import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-001.pdf');
  });
}

class InvoiceModal extends React.Component {
  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture">
            
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">{this.props.info.companyName || 'John Doe Company'}</h4>
               
              </div>
            </div>

            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">From:</div>
                  <div>{this.props.info.companyDetails || ''}</div>
                  <div>{this.props.info.invoiceNumber ? `Invoice No: ${this.props.info.invoiceNumber}` : 'Invoice No'}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo || ''}</div>
                  <div>{this.props.info.billToAddress || ''}</div>
                  <div>{this.props.info.billToEmail || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Ship To:</div>
                  <div>{this.props.info.billFrom || ''}</div>
                  <div>{this.props.info.billFromAddress || ''}</div>
                  <div>{this.props.info.billFromEmail || ''}</div>
                  <div>{this.props.info.billFromCompanyName || ''}</div>
                  <div>{this.props.info.billFromGST || ''}</div>
                  <div>{this.props.info.billFromCity || ''}</div>
                  <div>{this.props.info.billFromState || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{this.props.info.dateOfIssue || ''}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th>HSN</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td> 
                      <td style={{ width: '70px' }}>{item.quantity}</td>
                      <td>{item.name} - {item.description}</td>
                      <td style={{ width: '100px' }}>{item.hsn}</td> 
                      <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {parseFloat(item.price).toFixed(2)}</td>
                      <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>SUBTOTAL</td>
                    <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {parseFloat(this.props.subTotal).toFixed(2)}</td>
                  </tr>
                  {parseFloat(this.props.taxAmmount) !== 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>TAX</td>
                      <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {parseFloat(this.props.taxAmmount).toFixed(2)}</td>
                    </tr>
                  }
                  {parseFloat(this.props.discountAmmount) !== 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>DISCOUNT</td>
                      <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {parseFloat(this.props.discountAmmount).toFixed(2)}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>TOTAL</td>
                    <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {parseFloat(this.props.total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
              {this.props.info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>}
            </div>
          </div>

          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={GenerateInvoice}>
                  <BiPaperPlane style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{ width: '16px', height: '16px', marginTop: '-3px' }} className="me-2" />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3" />
      </div>
    );
  }
}

export default InvoiceModal;*/
import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";

class InvoiceItem extends Component {
  render() {
    var onItemizedItemEdit = this.props.onItemizedItemEdit;
    var rowDel = this.props.onRowDel;
    var itemTable = this.props.items.map(function (item) {
      return (
        <ItemRow
          onItemizedItemEdit={onItemizedItemEdit}
          item={item}
          onDelEvent={rowDel}
          key={item.id}
        />
      );
    });
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>HSN/SAC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{itemTable}</tbody>
        </Table>
        <Button variant="primary" onClick={this.props.onRowAdd}>Add Item</Button>
      </div>
    );
  }
}

class ItemRow extends Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.item);
  }
  render() {
    return (
      <tr>
        <td>{this.props.item.id}</td>
        <td>
          <input
            type="text"
            name="description"
            id={this.props.item.id}
            value={this.props.item.description}
            onChange={this.props.onItemizedItemEdit}
          />
        </td>
        <td>
          <input
            type="number"
            name="quantity"
            id={this.props.item.id}
            value={this.props.item.quantity}
            onChange={this.props.onItemizedItemEdit}
          />
        </td>
        <td>
          <input
            type="number"
            name="price"
            id={this.props.item.id}
            value={this.props.item.price}
            onChange={this.props.onItemizedItemEdit}
          />
        </td>
        <td>
          <input
            type="text"
            name="hsn"
            id={this.props.item.id}
            value={this.props.item.hsn}
            onChange={this.props.onItemizedItemEdit}
          />
        </td>
        <td>
          <Button variant="danger" onClick={this.onDelEvent.bind(this)}>Delete</Button>
        </td>
      </tr>
    );
  }
}

export default InvoiceItem;
