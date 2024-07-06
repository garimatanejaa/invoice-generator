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
    const taxAmount = parseFloat(info.taxAmmount) || 0;
    const discountAmount = parseFloat(info.discountAmmount) || 0;
    const handlingCharges = parseFloat(info.handlingcharge) || 0.0;
    const haulingCharges = parseFloat(info.haulcharge) || 0.0;
    const shippingCharges = parseFloat(info.shippingcharge) || 0.0;
    const deliveryCharges = parseFloat(info.deliverycharge) || 0.0;
    const total = subTotal + taxAmount - discountAmount + handlingCharges + haulingCharges + shippingCharges + deliveryCharges;

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
                  <div className="fw-bold">From:</div>
                  <div>{companyDetails}</div>
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
                  {taxAmount !== 0 &&
                    <tr className="text-end">
                      <td colSpan="2" className="fw-bold">TAX</td>
                      <td className="text-end">{currency} {parseFloat(taxAmount).toFixed(2)}</td>
                    </tr>
                  }
                  {discountAmount !== 0 &&
                    <tr className="text-end">
                      <td colSpan="2" className="fw-bold">DISCOUNT</td>
                      <td className="text-end">{currency} {parseFloat(discountAmount).toFixed(2)}</td>
                    </tr>
                  }
                  {handlingCharges !== 0 &&
                    <tr className="text-end">
                      <td colSpan="2" className="fw-bold">HANDLING CHARGES</td>
                      <td className="text-end">{currency} {parseFloat(handlingCharges).toFixed(2)}</td>
                    </tr>
                  }
                  {shippingCharges !== 0 &&
                    <tr className="text-end">
                      <td colSpan="2" className="fw-bold">SHIPPING CHARGES</td>
                      <td className="text-end">{currency} {parseFloat(shippingCharges).toFixed(2)}</td>
                    </tr>
                  }
                  {haulingCharges !== 0 &&
                    <tr className="text-end">
                      <td colSpan="2" className="fw-bold">HAULING CHARGES</td>
                      <td className="text-end">{currency} {parseFloat(haulingCharges).toFixed(2)}</td>
                    </tr>
                  }
                  {deliveryCharges !== 0 &&
                    <tr className="text-end">
                      <td colSpan="2" className="fw-bold">DELIVERY CHARGES</td>
                      <td className="text-end">{currency} {parseFloat(deliveryCharges).toFixed(2)}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td colSpan="2" className="fw-bold">TOTAL</td>
                    <td className="text-end">{currency} {parseFloat(total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>

              {notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {notes}
                </div>
              }
            </div>
          </div>

          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={this.generateInvoice}>
                  <BiPaperPlane style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={this.generateInvoice}>
                  <BiCloudDownload style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />Download PDF
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

export default InvoiceModal;



