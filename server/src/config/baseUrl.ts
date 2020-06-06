import nconf from 'nconf';

class BaseUrl {
    
    url(paths?: String[]) {
        nconf.file('package.json');
        const protocol = nconf.get('host:protocol');
        const host = nconf.get('host:host');
        const port = nconf.get('host:port');

        const url = `${protocol}://${host}:${port}`;

        if (paths) {
            return `${url}${paths.join("")}`;
        }

        return url;
    }

    port() {
        nconf.file('package.json');
        const port = nconf.get('host:port');
        return port;
    }
}

export default BaseUrl;