import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import numWords from 'num-words';
import {
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';

class InvoiceModal extends React.Component {
  generateInvoice = () => {
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

  render() {
    const { showModal, closeModal, info, items, currency } = this.props;

    const defaultInfo = {
      companyName: 'John Doe Company',
      companyDetails: '',
      companyDetails1:'',
      invoiceNumber: 'Invoice No',
      billTo: '',
      billToAddress: '',
      billToEmail: '',
      billFrom: '',
      billFromAddress: '',
      billFromEmail: '',
      billFromCompanyName: '',
      billFromGST: '',
      billFromCity: '',
      billFromState: '',
      dateOfIssue: '',
      notes: ''
    };

    const {
      companyName,
      companyDetails,
      companyDetails1,
      invoiceNumber,
      billTo,
      billToAddress,
      billToEmail,
      billFrom,
      billFromAddress,
      billFromEmail,
      billFromCompanyName,
      billFromGST,
      billFromCity,
      billFromState,
      dateOfIssue,
      notes
    } = { ...defaultInfo, ...info };

    const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cgstAmount = (subTotal * (info.cgst / 100)).toFixed(2);
    const sgstAmount = (subTotal * (info.sgst / 100)).toFixed(2);
    const taxAmount = parseFloat(info.taxAmount) || 0;
    const discountAmount = parseFloat(info.discountAmount) || 0;
    const handlingCharges = parseFloat(info.handlingcharge) || 0.0;
    const haulingCharges = parseFloat(info.haulcharge) || 0.0;
    const shippingCharges = parseFloat(info.shippingcharge) || 0.0;
    const deliveryCharges = parseFloat(info.deliverycharge) || 0.0;
    const total = subTotal + parseFloat(cgstAmount) + parseFloat(sgstAmount) + taxAmount - discountAmount + handlingCharges + haulingCharges + shippingCharges + deliveryCharges;

    const totalInWords = numWords(Math.round(total));

    return (
      <div>
        <Modal show={showModal} onHide={closeModal} size="lg" centered>
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">{companyName}</h4>
              </div>
            </div>

            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold mt-2">Invoice No:</div>
                  <div>{invoiceNumber}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">From:</div>
                  <div>{companyDetails}</div>
                  <div>{companyDetails1}</div>
                  <div>{invoiceNumber}</div>
                </Col>

                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{billTo}</div>
                  <div>{billToAddress}</div>
                  <div>{billToEmail}</div>
                </Col>

                <Col md={4}>
                  <div className="fw-bold">Ship To:</div>
                  <div>{billFrom}</div>
                  <div>{billFromAddress}</div>
                  <div>{billFromEmail}</div>
                  <div>{billFromCompanyName}</div>
                  <div>{billFromGST}</div>
                  <div>{billFromCity}</div>
                  <div>{billFromState}</div>
                </Col>

                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{dateOfIssue}</div>
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
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.quantity}</td>
                      <td>{item.name} - {item.description}</td>
                      <td>{item.hsn}</td>
                      <td className="text-end">{currency} {parseFloat(item.price).toFixed(2)}</td>
                      <td className="text-end">{currency} {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Table>
                <tbody>
                  <tr>
                    <td colSpan="3">&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">SUBTOTAL</td>
                    <td className="text-end">{currency} {parseFloat(subTotal).toFixed(2)}</td>
                  </tr>
                  {parseFloat(cgstAmount) > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">CGST</td>
                    <td className="text-end">{currency} {cgstAmount}</td>
                  </tr>
                  }
                  {parseFloat(sgstAmount) > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">SGST</td>
                    <td className="text-end">{currency} {sgstAmount}</td>
                  </tr>
                  }
                  {taxAmount > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">IGST</td>
                    <td className="text-end">{currency} {taxAmount}</td>
                  </tr>
                  }
                  {discountAmount > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">DISCOUNT</td>
                    <td className="text-end">{currency} {discountAmount}</td>
                  </tr>
                  }
                  {handlingCharges > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">HANDLING CHARGES</td>
                    <td className="text-end">{currency} {parseFloat(handlingCharges).toFixed(2)}</td>
                  </tr>
                  }
                  {haulingCharges > 0 && 
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">HAULAGE CHARGES</td>
                    <td className="text-end">{currency} {parseFloat(haulingCharges).toFixed(2)}</td>
                  </tr>
                  }
                  {shippingCharges > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">SHIPPING CHARGES</td>
                    <td className="text-end">{currency} {parseFloat(shippingCharges).toFixed(2)}</td>
                  </tr>
                  } 
                  {deliveryCharges > 0 &&
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">DELIVERY CHARGES</td>
                    <td className="text-end">{currency} {parseFloat(deliveryCharges).toFixed(2)}</td>
                  </tr>
                  }
                  <tr className="text-end fw-bold">
                    <td colSpan="2" className="h4">TOTAL</td>
                    <td className="h4 text-end">{currency} {parseFloat(total).toFixed(2)}</td>
                  </tr>
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">TOTAL IN WORDS Rs.</td>
                    <td className="text-end">{totalInWords} rupees only.</td>
                    </tr>

                </tbody>
              </Table>

              <div className="bg-white py-3 px-4">
                <p className="mb-0">{notes}</p>
              </div>
              <div className="bg-white py-3 px-4">
                <p className="mb-0">This is a computer generated reciept.</p>
              </div>
            </div>
          </div>
          <Modal.Footer>
            <Button variant="success" onClick={this.generateInvoice}><BiCloudDownload className="me-2" />Download PDF</Button>
            <EmailShareButton url="#" subject="Invoice" body="Here is your invoice.">
              <Button variant="primary"><BiPaperPlane className="me-2" />Share via Email</Button>
            </EmailShareButton>
            <WhatsappShareButton url="#" title="Invoice">
              <Button variant="primary"><BiPaperPlane className="me-2" />Share via WhatsApp</Button>
            </WhatsappShareButton>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default InvoiceModal;

