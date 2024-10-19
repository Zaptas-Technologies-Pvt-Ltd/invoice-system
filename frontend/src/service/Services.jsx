import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import qs from 'qs';

const superagent = superagentPromise(_superagent, global.Promise);

//local
const API_ROOT = '/api';

//live
// const API_ROOT = 'https://invoice.zaptas.in/v1/api';


const encode = encodeURIComponent;
const responseBody = res => res.body;


const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};


const Common = {
  customer: () => requests.get('/customer'),
  customerByid: (id) => requests.get('/customerByid/'+id),
  services: () => requests.get('/services'),
  servicesByid: (id) => requests.get('/servicesByid/'+id),
  tax: () => requests.get('/tax'),
  company: () => requests.get('/company'),
  invoice : (id) =>  requests.get('/getInvoiceByid/'+id),
  allinvoice: () => requests.get('/getInvoice'),
  service_create: (object) => requests.post('/service/create', qs.stringify(object)),
  service_update: (id , object) => requests.put('/service/update/'+id, qs.stringify(object)),
  invoice_update: (id) => requests.put('/invoice/update/'+id),
  status_update: (id) => requests.post('/commonStatus/update/'+id),
  delete_update: (id) => requests.post('/commonDelete/update/'+id),
  edit_service: (id , object) => requests.put('/editservice/update/'+id, qs.stringify({"service_name":object})),
  customercreate: (object) => requests.post('/customer/create', qs.stringify(object)),
  customer_update: (id , object) => requests.put('/customer/update/'+id, qs.stringify(object)),

  login:(object) => requests.post('/authLogin', qs.stringify(object)),
  profile_create: (object) => requests.post('/profileCreate', qs.stringify(object)),
  profile_update: (id, object) => requests.post('/profileUpdate/'+id, qs.stringify(object)),
  password_update: (id , object) => requests.put('/updatePass/'+id, qs.stringify(object)),
};

const Invoice = {
  create: (customer , service , serviceName ,serviceCode, profilesDetails, tax , po , podate, invoiceDate,  payment) => requests.post('/invoice', qs.stringify({ 
      "customer":customer,
      "service": service,
      "serviceName":serviceName,
      "serviceCode":serviceCode,
      "profilesDetails": profilesDetails,
      "tax":tax,
      "po": po,
      "podate": podate,
      "payment":payment,
      "createdAt":invoiceDate
    })),
}
const poCreate = {
  create: (customer,service,serviceName,serviceCode,
      polistData,tax,ponuber,podate
    )=> requests.post('/pocreate', qs.stringify({ 
      "customer":customer,
      "service": service,
      "serviceName":serviceName,
      "serviceCode":serviceCode,
      "polistData":polistData,
      "tax":tax,
      "ponuber": ponuber,
      "podate": podate,
    })),
}

export default {
  Common,
  Invoice,
  poCreate
};
