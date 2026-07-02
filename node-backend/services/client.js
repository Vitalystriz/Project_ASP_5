const net = require('net')

const CSERVER_HOST = process.env.BACKEND_HOST || 'server'
const CSERVER_PORT = parseInt(process.env.BACKEND_PORT || '8080')

const sendToCppServer = (message) => {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({ host: CSERVER_HOST, port: CSERVER_PORT }, () => {
            client.write(message + '\n')
        })

        client.setTimeout(5000);

        client.on('timeout', () => {
            console.error(`[TIMEOUT] C++ server communication timed out after 5000ms`);
            client.destroy();
            reject(new Error("Timeout communicating with C++ server"));
        });

        client.on('data', (data) => {
            resolve(data.toString().trim())
            client.end()
        })

        client.on('error', (err) => {
            reject(err)
        })
    })
}

const fetchRecommendations = async (userId, targetId) => {

    const rawResponse = await sendToCppServer(`GET ${userId} ${targetId}`);

    if (!rawResponse) {
        throw new Error("Empty response from cpp server");
    }

    console.log("response: "+rawResponse)
    // Split response into raws
    const lines = rawResponse.split('\n').map(line => line.trim());

    // The first raw must be a status - 200 or 404
    const statusLine = lines[0];

    if (statusLine !== '200 Ok') {
        if (statusLine.includes('404 Not Found')) {
            throw new Error(`404 Not Found`);
        }
        throw new Error(`Cpp server returns error: ${statusLine}`);
    }

    // Body of the response
    const dataLine = lines[lines.length - 1];


    if (!dataLine || dataLine === statusLine) {
        return [];
    }

    // Parsing by whitespce
    return dataLine
        .split(/\s+/)
        .filter(id => id.length > 0);
}

module.exports = {
    sendToCppServer,
    fetchRecommendations
}