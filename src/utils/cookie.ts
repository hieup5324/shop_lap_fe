import STORAGE from '../shared/local-storage-key';

const setCookie = (cName: string, cvalue: string, exdays: number) => {
	const cNameWithPrefix = `${STORAGE.PREFIX}-${cName}`;

	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);

	const expires = 'expires=' + d.toUTCString();
	document.cookie = cNameWithPrefix + '=' + cvalue + ';' + expires + ';path=/';
};

const getCookie = (cName: string) => {
	const cNameWithPrefix = `${STORAGE.PREFIX}-${cName}`;

	const name = cNameWithPrefix + '=';
	const cookieArr = document.cookie.split(';');

	for (let i = 0; i < cookieArr.length; i++) {
		let c = cookieArr[i];

		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
};

const deleteCookie = (cName: string) => {
	const cNameWithPrefix = `${STORAGE.PREFIX}-${cName}`;
	document.cookie = `${cNameWithPrefix}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export { getCookie, setCookie, deleteCookie };
