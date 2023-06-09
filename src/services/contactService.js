import NetService from "../netService";

const EP_CONTACT_REQUESTS = 'contactrequests';
const EP_CONTACT_REQUESTS_SELF = 'contactrequests/self';
const EP_CONTACTS = 'contacts';

export default class ContactService extends NetService {
	createRequest(destUserName) {
		return this.put(EP_CONTACT_REQUESTS + '/' + destUserName) ;
	}

	acceptRequest(userName) {
		return this.post(EP_CONTACT_REQUESTS_SELF + '/' + userName) ;
	}

	dismissRequest(userName) {
		return this.delete(EP_CONTACT_REQUESTS_SELF + '/' + userName) ;
	}

	removeContact(userName) {
		return this.delete(EP_CONTACTS + '/' + userName) ;
	}

	retrieveContacts(isAuto = false) {
		return this.get(EP_CONTACTS, isAuto ? {noErrorClear: true, noSlowRequestHandling: true} : {}) ;
	}
}