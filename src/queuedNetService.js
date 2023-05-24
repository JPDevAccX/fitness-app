import NetService, { API_URL, CONTENT_JSON } from "./netService";

export default class QueuedNetService extends NetService {
	constructor() {
		super(...arguments) ;
		this.queue = [] ;
	}

	_processQueue() {
		const time = new Date().getTime() ;
		for (const [queueId, requestInfo] of Object.entries(this.queue)) {
			if (time >= requestInfo.queueTimeout) {
				const {method, url, data, extraHeaders, opts, resolve, reject} = requestInfo ;
				delete this.queue[queueId] ;
				super.request(method, url, data, extraHeaders, opts).then(response => resolve(response)).catch((err) => reject(err)) ;
			}
		}
		if (Object.keys(this.queue).length > 0) setTimeout(() => this._processQueue(), 100) ;
	}

	request(method, url, data = null, extraHeaders = {}, opts = {}) {
		if (opts.queueId) {
			const queueTimeout = (new Date().getTime()) + opts.queueTimeout ;
			const promise = new Promise((resolve, reject) => {
				this.queue[opts.queueId] = {method, url, data, extraHeaders, opts, queueTimeout, resolve, reject} ;
			}) ;
			setTimeout(() => this._processQueue(), 100) ;
			return promise ;
		}
		else return super.request(method, url, data = null, extraHeaders = {}, opts = {})
	}

	// Empty-body functions
	get(epUrl, opts = {}) {
		return this.request('get', API_URL + epUrl, null, {}, opts);
	}
	delete(epUrl, opts = {}) {
		return this.request('delete', API_URL + epUrl, null, {}, opts);
	}

	// JSON functions
	post(epUrl, data = null, opts = {}) {
		return this.request('post', API_URL + epUrl, data, CONTENT_JSON, opts);
	}
	put(epUrl, data = null, opts = {}) {
		return this.request('put', API_URL + epUrl, data, CONTENT_JSON, opts);
	}
	patch(epUrl, data = null, opts = {}) {
		return this.request('patch', API_URL + epUrl, data, CONTENT_JSON, opts);
	}
}