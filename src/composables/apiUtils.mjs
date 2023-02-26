/**
 * Class that is used to get data from the API
 * Written by: David Farah
 * Email: david.farah@epfl.ch
 */
export default class apiUtils {
    serverAddress = "http://localhost:3000"
    //serverAddress = "http://34.65.125.98:3000"
    apiPath = "/api/configs/"

    /**
     * Method called when object is built
     * @param apiPath can be used to set a different api endpoint
     */
    constructor(apiPath) {
        if (apiPath) this.apiPath = apiPath
    }

    /**
     * Get raw configuration data from API
     * @param configName Name of the config file
     * @returns {Promise<any>} config json data promise (async)
     */
    async getConfig(configName) {
        let response = await fetch(this.serverAddress + this.apiPath + configName)
        return JSON.parse(await response.text())
    }
}