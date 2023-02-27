
export default class ConfigUtils {
    #configObject = null
    #dataObject = null

    /**
     * Constructor of the class
     * @param configObject the configuration javascript object retrieved from the api
     */
    constructor(configObject) {
        try {
            this.#configObject = configObject
            this.#buildDataObject()
        } catch (e) {
            console.log(e);
            process.exit(1)
        }
    }

    /**
     * method that build the data object used to update values in the pages
     * initialize values to null
     */
    #buildDataObject() {
        this.#dataObject = {}
        if (this.#configObject) {
            Object.entries(this.#configObject).forEach(([componentName, component]) => {
                Object.entries(component).forEach(([subTopicName, subtopic]) => {
                        this.#createNestedObject(
                            this.#dataObject,
                            [componentName, subTopicName],
                            [null, subtopic["unit"]]
                            )
                })
            })
        }
    }

    /**
     * Method that assigns a value to the path names in the base, or creates the element dynamically if required
     * It updates the original base, so no need to reassign
     * @param base
     * @param names
     * @param value
     * @returns {*}
     */
    #createNestedObject(base, names, value) {
        // If a value is given, remove the last name and keep it for later:
        let lastName = arguments.length === 3 ? names.pop() : false;

        // Walk the hierarchy, creating new objects where needed.
        // If the lastName was removed, then the last object is not set yet:
        for(let i = 0; i < names.length; i++ ) {
            base = base[ names[i] ] = base[ names[i] ] || {};
        }

        // If a value was given, set it to the last name:
        if( lastName ) base = base[ lastName ] = value;

        // Return the last object in the hierarchy:
        return base;
    };


    /**
     * Pretty print javascript object
     * @param obj
     */
    #printObject(obj) {
        console.log(JSON.stringify(obj, null, 2))
    }

    //---------------GETTERS----------------------

    getDataObject(){
        return this.#dataObject
    }
}