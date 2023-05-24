import QueuedNetService from "../queuedNetService";

const EP_USERVALUEHISTORY = 'userValueHistory';
const EP_USERVALUEHISTORY_FIRSTVALFORFIELD = EP_USERVALUEHISTORY + '/getFirstValueForField' ;

export default class UserValuesHistoryService extends QueuedNetService {
	getAllHistory() {
		return this.get(EP_USERVALUEHISTORY) ;
	}

	retrieveFirstValForField(fieldName) {
		return this.get(EP_USERVALUEHISTORY_FIRSTVALFORFIELD + '/' + fieldName) ;
	}

	setHistoryFieldValue(date, fieldName, value) {
		const fieldId = date + '/' + fieldName ;
		return this.patch(EP_USERVALUEHISTORY + '/' + fieldId, {value}, {queueId: fieldId, queueTimeout: 200}) ;
	}
}