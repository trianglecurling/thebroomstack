import qfs = require("./qfs");
import path = require("path");
import Q = require("q");

interface KeyPair {
	public: string;
	private: string;
}

module Bootstrap {

	const SECRETS_PATH = path.join(require.main.filename, "../../..", "_private");
	const PUBLIC_KEY_PATH = path.join(SECRETS_PATH, "key.pub.pem");
	const PRIVATE_KEY_PATH = path.join(SECRETS_PATH, "key.pem");

	export async function init(): Promise<KeyPair> {
		const pubKey = await qfs.readFile(PUBLIC_KEY_PATH);
		const privKey = await qfs.readFile(PRIVATE_KEY_PATH);

		return { public: pubKey, private: privKey };
	}
}

export = Bootstrap;
