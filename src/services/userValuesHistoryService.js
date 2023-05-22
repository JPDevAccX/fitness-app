import NetService from "../netService";

const EP_USERVALUEHISTORY = 'userValueHistory';
const EP_USERVALUEHISTORY_FIRSTVALFORFIELD = EP_USERVALUEHISTORY + '/getFirstValueForField' ;

export default class UserValuesHistoryService extends NetService {
	getAllHistory() {
		return this.get(EP_USERVALUEHISTORY) ;
	}

	retrieveFirstValForField(fieldName) {
		return this.get(EP_USERVALUEHISTORY_FIRSTVALFORFIELD + '/' + fieldName) ;
	}

	setHistoryFieldValue(date, fieldName, value) {
		return this.patch(EP_USERVALUEHISTORY + '/' + date + '/' + fieldName, {value}) ;
	}
}