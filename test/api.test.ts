import path from "node:path";
import { test } from "node:test";
import axios, { type AxiosError, AxiosHeaders, isAxiosError } from "axios";
import { config } from "dotenv";
import {
	Configuration,
	ImagesApi,
	RegionsApi,
	SSHKeysApi,
	SizesApi,
} from "../dist/index.js";

config({ path: path.join(import.meta.dirname, "app.env") });
const _config = new Configuration({
	accessToken: process.env.TOKEN,
	// accessToken: 'XXXXXXX'
});

axios.interceptors.request.use((_request) => {
	console.log(`Request: ${_request.url}`);
	console.log(_request.headers);
	console.log(_request.data);
	return _request;
});

axios.interceptors.response.use((_response) => {
	console.log(`Reponse: ${_response.config.url}`);
	console.log(_response.status);
	console.log(_response.headers);
	console.log(_response.data);
	return _response;
});

test("Testing Sizes list api call", async (context) => {
	const api = new SizesApi(_config);
	const response = api.sizesList();
	let success = false;
	console.log(response);
	await response
		.then((_value) => {
			_value.data.sizes.forEach((_size) => {
				console.log(_size.slug);
			});
			success = true;
		})
		.catch(logErrors);
	context.assert.equal(success, true);
});

test("Testing Image list api call", async (context) => {
	const api = new ImagesApi(_config);
	const response = api.imagesList();
	let success = false;
	console.log(response);
	await response
		.then((_value) => {
			_value.data.images.forEach((_image) => {
				console.log(_image.slug);
			});
			success = true;
		})
		.catch(logErrors);
	context.assert.equal(success, true);
});

test("Testing SSH list api call", async (context) => {
	const api = new SSHKeysApi(_config);
	const response = api.sshKeysList();
	let success = false;
	console.log(response);
	await response
		.then((_value) => {
			_value.data.ssh_keys?.forEach((_key) => {
				console.log(_key.name);
			});
			success = true;
		})
		.catch(logErrors);
	context.assert.equal(success, true);
});

test("Testing Regions list api call", async (context) => {
	const api = new RegionsApi(_config);
	const response = api.regionsList();
	let success = false;
	console.log(response);
	await response
		.then((_value) => {
			_value.data.regions?.forEach((_regions) => {
				console.log(_regions.slug);
			});
			success = true;
		})
		.catch(logErrors);
	context.assert.equal(success, true);
});

function logErrors(_reason: any) {
	console.log(isAxiosError(_reason));
	if (isAxiosError(_reason)) {
		const axiosReason = _reason as AxiosError;
		console.log(axiosReason.stack);
	}
}
