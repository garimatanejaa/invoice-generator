/*import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '₹', // Default currency set to ₹
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      companyName: '',
      companyDetails: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmmount: '0.00',
      discountRate: '',
      discountAmmount: '0.00',
      title: 'Invoice', // Default title set to Invoice
      haulcharge: '0.00' // Initialize haulcharge with 0.00
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1.00',
        quantity: 1,
        hsn: ''
      }
    ];
    this.editField = this.editField.bind(this);
  }

  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }

  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };

  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }

  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.map(function(item) {
      subTotal = parseFloat(subTotal + (parseFloat(item.price).toFixed(2) * parseInt(item.quantity))).toFixed(2)
    });

    this.setState({
      subTotal: parseFloat(subTotal).toFixed(2)
    }, () => {
      this.setState({
        taxAmmount: parseFloat(parseFloat(subTotal) * (this.state.taxRate / 100)).toFixed(2)
      }, () => {
        this.setState({
          discountAmmount: parseFloat(parseFloat(subTotal) * (this.state.discountRate / 100)).toFixed(2)
        }, () => {
            this.setState({
                total: ((subTotal - this.state.discountAmmount) + parseFloat(this.state.taxAmmount) + parseFloat(this.state.haulcharge)).toFixed(2)
              });
        });
      });
    });

  };

  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    if (item.name === "hsn") { // Ensure correct name comparison
        item.value = evt.target.value; // Update hsn value
      }
    if (item.name === "price") {
      item.value = parseFloat(item.value).toFixed(2); // Ensure price has only 2 decimal points
    }
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key === item.name && items.id === item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({items: newItems});
    this.handleCalculateTotal();
  };

  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };

  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({isOpen: true})
  };

  closeModal = (event) => this.setState({isOpen: false});

  toggleTitle = () => {
    const newTitle = this.state.title === 'Invoice' ? 'Quotation' : 'Invoice';
    this.setState({ title: newTitle });
  };

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current Date: </span>
                      <span className="current-date">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due Date: </span>
                    <Form.Control
                      type="date"
                      value={this.state.dateOfIssue}
                      name="dateOfIssue"
                      onChange={(event) => this.editField(event)}
                      style={{ maxWidth: '150px' }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <div className="d-flex flex-row align-items-center mb-2">
                    <span className="fw-bold me-2"> {this.state.title} Number: </span>
                    <Form.Control
                      type="number"
                      value={this.state.invoiceNumber}
                      name="invoiceNumber"
                      onChange={(event) => this.editField(event)}
                      min="1"
                      style={{ maxWidth: '70px' }}
                      required
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold me-2">Company Name: </span>
                    <Form.Control
                      placeholder="Enter Company Name"
                      value={this.state.companyName}
                      type="text"
                      name="companyName"
                      onChange={(event) => this.editField(event)}
                      required
                    />
                  </div>
                </div>
              </div>
              <Form.Label className="fw-bold">Company Details:</Form.Label>
              <Form.Control
                placeholder="Enter Business Owner Details"
                value={this.state.companyDetails}
                type="text"
                name="companyDetails"
                className="my-2"
                onChange={(event) => this.editField(event)}
                autoComplete="off"
                required
              />
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice to?"
                    rows={3}
                    value={this.state.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name"
                    
                  />
                  <Form.Control
                    placeholder="Line 2"
                    value={this.state.billTo1}
                    type="text"
                    name="billTo1"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name1"
                    
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={this.state.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => this.editField(event)}
                    
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Ship to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this going to be shipped to?"
                    rows={3}
                    value={this.state.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name"
                    
                  />
                  <Form.Control
                    placeholder="Line 2"
                    value={this.state.billFrom1}
                    type="text"
                    name="billFrom1"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name1"
                    
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={this.state.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => this.editField(event)}
                    
                  />
                </Col>
              </Row>
              <InvoiceItem
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.currency}
                items={this.state.items}
              />
              <hr className="my-4" />
              <Row className="mb-5">
                <Col md={6} lg={5} className="ms-auto">
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal: </span>
                    <span>{this.state.currency}{this.state.subTotal}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Haulage Charges </span>
                    <span>{this.state.currency}{this.state.haulcharge || 0}</span>
                 </div>

                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount: </span>
                    <span>
                      <span className="small">({this.state.discountRate || 0}%)</span>
                      {this.state.currency}{this.state.discountAmmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">GST: </span>
                    <span>
                      <span className="small">({this.state.taxRate || 0}%)</span>
                      {this.state.currency}{this.state.taxAmmount || 0}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: '1.125rem' }}>
                    <span className="fw-bold">Total: </span>
                    <span className="fw-bold">{this.state.currency}{this.state.total}</span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
                placeholder="Thanks for your business!"
                name="notes"
                value={this.state.notes}
                onChange={(event) => this.editField(event)}
                as="textarea"
                className="my-2"
                rows={1}
              />
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">
                Review {this.state.title}
              </Button>
              <InvoiceModal
                showModal={this.state.isOpen}
                closeModal={this.closeModal}
                info={this.state}
                items={this.state.items}
                currency={this.state.currency}
                subTotal={this.state.subTotal}
                taxAmmount={this.state.taxAmmount}
                discountAmmount={this.state.discountAmmount}
                total={this.state.total}
              />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  onChange={event => this.onCurrencyChange({ currency: event.target.value })}
                  className="btn btn-light my-1"
                  aria-label="Change Currency"
                >
                  <option value="₹">INR (Indian Rupee)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">GST 18%:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    type="number"
                    value={this.state.taxRate}
                    onChange={(event) => this.editField(event)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="percentage"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Haulage Charges:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                    name="haulcharge"
                    type="number"
                    value={this.state.haulcharge}
                    onChange={(event) => this.editField(event)} // Ensure this updates haulcharge
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                    />
                    <InputGroup.Text className="bg-light fw-bold text-secondary small">₹</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    type="number"
                    value={this.state.discountRate}
                    onChange={(event) => this.editField(event)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Button variant="secondary" onClick={this.toggleTitle} className="w-100">
                Switch to {this.state.title === 'Invoice' ? 'Quotation' : 'Invoice'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;*/
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '₹', // Default currency set to ₹
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      companyName: '',
      companyDetails: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '0.00',
      taxAmmount: '0.00',
      discountRate: '',
      discountAmmount: '0.00',
      title: 'Invoice', // Default title set to Invoice
      haulcharge: '0.00', // Initialize haulcharge with 0.00
      deliverycharge: '0.00', // Initialize deliverycharge with 0.00
      handlingcharge: '0.00', // Initialize handlingcharge with 0.00
      shippingcharge: '0.00', // Initialize shippingcharge with 0.00
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1.00',
        quantity: 1,
        hsn: ''
      }
    ];
    this.editField = this.editField.bind(this);
  }

  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }

  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };

  handleAddEvent(evt) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1,
      hsn: ''
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }

  handleCalculateTotal() {
    const { items, taxRate, discountRate, haulcharge, deliverycharge, handlingcharge, shippingcharge } = this.state;
  
    // Calculate subtotal
    let subTotal = 0;
    items.forEach(item => {
      const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
      subTotal += itemTotal;
    });
    subTotal = parseFloat(subTotal).toFixed(2);
  
    // Calculate tax amount
    const taxAmmount = (subTotal * (taxRate / 100)).toFixed(2);
  
    // Calculate discount amount
    const discountAmmount = (subTotal * (discountRate / 100)).toFixed(2);
  
    // Calculate additional charges
    const additionalCharges = parseFloat(haulcharge) + parseFloat(deliverycharge) + parseFloat(handlingcharge) + parseFloat(shippingcharge);
  
    // Calculate total
    let total = subTotal - discountAmmount + parseFloat(taxAmmount) + additionalCharges;
    total = parseFloat(total).toFixed(2);
  
    this.setState({
      subTotal,
      taxAmmount,
      discountAmmount,
      total
    });
  }
  

  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    if (item.name === "hsn") { // Ensure correct name comparison
      item.value = evt.target.value; // Update hsn value
    }
    if (item.name === "price") {
      item.value = parseFloat(item.value).toFixed(2); // Ensure price has only 2 decimal points
    }
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key === item.name && items.id === item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal();
  };

  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };

  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({ isOpen: true })
  };

  closeModal = (event) => this.setState({ isOpen: false });

  toggleTitle = () => {
    const newTitle = this.state.title === 'Invoice' ? 'Quotation' : 'Invoice';
    this.setState({ title: newTitle });
  };

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current Date: </span>
                      <span className="current-date">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due Date: </span>
                    <Form.Control
                      type="date"
                      value={this.state.dateOfIssue}
                      name="dateOfIssue"
                      onChange={(event) => this.editField(event)}
                      style={{ maxWidth: '150px' }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <div className="d-flex flex-row align-items-center mb-2">
                    <span className="fw-bold me-2">{this.state.title} Number: </span>
                    <Form.Control
                      type="number"
                      value={this.state.invoiceNumber}
                      name="invoiceNumber"
                      onChange={(event) => this.editField(event)}
                      min="1"
                      style={{ maxWidth: '70px' }}
                      required
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold me-2">Company Name: </span>
                    <Form.Control
                      placeholder="Enter Company Name"
                      value={this.state.companyName}
                      type="text"
                      name="companyName"
                      onChange={(event) => this.editField(event)}
                      required
                    />
                  </div>
                </div>
              </div>
              <Form.Label className="fw-bold">Company Details:</Form.Label>
              <Form.Control
                placeholder="Enter Business Owner Details"
                value={this.state.companyDetails}
                type="text"
                name="companyDetails"
                className="my-2"
                onChange={(event) => this.editField(event)}
                autoComplete="off"
                required
              />
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice to?"
                    rows={3}
                    value={this.state.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name"
                  />
                  <Form.Control
                    placeholder="Line 2"
                    value={this.state.billTo1}
                    type="text"
                    name="billTo1"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name1"
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={this.state.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => this.editField(event)}
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Ship to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this going to be shipped to?"
                    rows={3}
                    value={this.state.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name"
                  />
                  <Form.Control
                    placeholder="Line 2"
                    value={this.state.billFrom1}
                    type="text"
                    name="billFrom1"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name1"
                  />
                  <Form.Control
                    placeholder="Shipping address"
                    value={this.state.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => this.editField(event)}
                  />
                </Col>
              </Row>
              <InvoiceItem
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.currency}
                items={this.state.items}
              />
              <div className="d-flex flex-row align-items-center justify-content-between">
                <Form.Group className="mb-3 me-5">
                  <Form.Label className="fw-bold">Currency:</Form.Label>
                  <Form.Control
                    as="select"
                    value={this.state.currency}
                    onChange={(e) => this.onCurrencyChange({ currency: e.target.value })}
                    className="ms-2"
                  >
                    <option value="₹">INR</option>
                    <option value="$">USD</option>
                    <option value="€">EUR</option>
                    <option value="£">GBP</option>
                    <option value="¥">JPY</option>
                  </Form.Control>
                </Form.Group>
                <Button onClick={this.toggleTitle} variant="outline-primary">{this.state.title === 'Invoice' ? 'Switch to Quotation' : 'Switch to Invoice'}</Button>
              </div>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="p-4 my-3 my-xl-4">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Hauling Charges:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{this.state.currency}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={this.state.haulcharge}
                    name="haulcharge"
                    onChange={(event) => this.editField(event)}
                    min="0"
                    step="0.01"
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Delivery Charges:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{this.state.currency}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={this.state.deliverycharge}
                    name="deliverycharge"
                    onChange={(event) => this.editField(event)}
                    min="0"
                    step="0.01"
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Handling Charges:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{this.state.currency}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={this.state.handlingcharge}
                    name="handlingcharge"
                    onChange={(event) => this.editField(event)}
                    min="0"
                    step="0.01"
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Shipping Charges:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{this.state.currency}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={this.state.shippingcharge}
                    name="shippingcharge"
                    onChange={(event) => this.editField(event)}
                    min="0"
                    step="0.01"
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
               placeholder="Thanks for your business!"
               name="notes"
               value={this.state.notes}
               onChange={(event) => this.editField(event)}
               as="textarea"
               className="my-2"
               rows={1}
               />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tax Rate:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={this.state.taxRate}
                    name="taxRate"
                    onChange={(event) => this.editField(event)}
                    min="0"
                    step="0.01"
                    required
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Discount Rate:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={this.state.discountRate}
                    name="discountRate"
                    onChange={(event) => this.editField(event)}
                    min="0"
                    step="0.01"
                    required
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <hr className="my-4" />
              <h5 className="fw-bold">Total: {this.state.currency}{this.state.total}</h5>
            </Card>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Preview {this.state.title}
        </Button>
        <InvoiceModal
          showModal={this.state.isOpen}
          closeModal={this.closeModal}
          info={this.state}
          items={this.state.items}
          currency={this.state.currency}
        />
      </Form>
    );
  }
}

export default InvoiceForm;
