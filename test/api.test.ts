import path from "node:path";
import { test } from "node:test";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { config } from "dotenv";
import { Configuration, SSHKeysApi, SizesApi } from "../dist";

config({ path: path.join(__dirname, "app.env") });
const _config = new Configuration({ accessToken: process.env.TOKEN });

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

test("Testing Sizes list api call", () => {
	const api = new SizesApi(_config);
	const response = api.sizesList();
	console.log(response);
	response.then((_value) => {
		_value.data.sizes.forEach((_size) => {
			console.log(_size.slug);
		});
	});
});

test("Testing SSH list api call", () => {
	const api = new SSHKeysApi(_config);
	const response = api.sshKeysList();
	console.log(response);
	response.then((_value) => {
		_value.data.ssh_keys?.forEach((_key) => {
			console.log(_key.name);
		});
	});
});
