<template>
  <section class="app-main">
    <slot :connected="connected"
          :dataObject="dataObject"
          :inputOptions="inputOptions"
          :subscribeToFields="subscribeToFields"
          :updateChildData="updateChildData"
          :canUpdateChildData="canUpdateChildData"
          :dataIsPresent="dataIsPresent"
          :inputOptionsIsPresent="inputOptionsIsPresent"
          :mqttUtil="mqttUtil"
    />
  </section>
</template>

<script>

import {computed, inject, onActivated, onDeactivated, ref} from "vue";
import mqttUtils from "@/composables/mqttUtils.mjs";
import configUtils from "@/composables/configUtils.mjs";

export default {
  setup: function () {
    let connected = ref(false); //Boolean value that indicates if the client is connected to the broker
    let dataObject = ref({})  //Object containing all our actual data, gets updated depending on subscribed topics
    let inputOptions = ref(null);

    let root_name = "dahu"

    let dataIsPresent = ref(false)
    let inputOptionsIsPresent = ref(false)

    let isActive = ref(false);  //indicate if the Home component is isActive

    /**
     * Callback activated when the component is being rendered
     */
    onActivated(()=> {
      isActive.value = true
      mqttUtil.resubscribeAll()
    })

    /**
     * Callback activated when the component stops being rendered
     */
    onDeactivated(()=> {
      isActive.value = false
      mqttUtil.unsubscribeAll()
    })

    buildDataObjects()

    /**
     * Create an mqttUtils instance with arguments the client and a callback to update data
     * @type {MqttUtils}
     */
    const mqttUtil = new mqttUtils(inject('mqttClient'), (topic, message) => {mqttUtils.updateDataFromJSON(message, dataObject, dataIsPresent.value)})

    addConnectedListeners()

    /**
     * Use the configuration fetched from the api to build the dataObject
     */
    async function buildDataObjects(){
      let apiClient = inject('apiClient');

      await apiClient.getConfig("CAN_out_config").then((outConfig)=> {
        let configUtilOut = new configUtils(outConfig)
        dataObject.value = configUtilOut.getDataObject()
        dataIsPresent.value = true
      })

      await apiClient.getConfig("CAN_in_config").then((inConfig)=> {
        inputOptions.value = inConfig
        inputOptionsIsPresent.value = true
      })

      return new Promise((resolve) => {if (dataIsPresent && inputOptionsIsPresent) resolve();})
    }

    /**
     * Add listeners to update the connected status
     */
    function addConnectedListeners(){
      if(mqttUtil.connected()) connected.value = true
      mqttUtil.on('connect', () => connected.value = true)
      mqttUtil.on('disconnect', () => connected.value = false)
      mqttUtil.on('reconnect', () => connected.value = false)
    }

    /**
     * Subscribe to the required topics if not already done
     * @param requiredValues array of required values containing path Strings: Component/Group
     */
    const subscribeToFields = (requiredValues) => {
      let fieldPathArray = []
      Object.entries(requiredValues).forEach(([, fieldPath])=>{
        fieldPathArray = fieldPath.split("/")
        mqttUtil.subscribeTo([`${root_name}/${fieldPathArray[0]}/${fieldPathArray[1]}`])
      })
    }

    /**
     * Update from the dataObject, the data  of a module based on their required fields
     * @param requiredFields array of required values containing path Strings: "Component/Group/Field"
     * @param childData The data object of the module. Follows the convention:
     *    {fieldAlias : groupObject} if the desired field is * (3rd value in the path) (refer to documentation for structure)
     *    {fieldAlias : [value, unit]} otherwise
     * Where fieldAlias is the name indicated in the childData and not in the main configuration file
     */
    const updateChildData = (requiredFields, childData) => {
      let fieldPathArray = []

      Object.entries(requiredFields).forEach(([fieldAlias, fieldPath]) => {
        try {
          fieldPathArray = fieldPath.split("/")
          if(fieldPathArray[2] === "*") {childData.value[fieldAlias] = dataObject.value[fieldPathArray[0]][fieldPathArray[1]]}
          else{childData.value[fieldAlias] = dataObject.value[fieldPathArray[0]][fieldPathArray[1]][fieldPathArray[2]]}
        }
        catch (error){
          if (error instanceof TypeError) {
            throw new Error("The path " + fieldPath + " doesn't exist in the configuration")
          } else {throw error;}
        }
      })
    }

    /**
     * Return true if a child module can request an update, false otherwise
     * We use dataIsPresent instead of the dataObject because it could be partially written (not null but not ready)
     * @type {ComputedRef<boolean>}
     */
    const canUpdateChildData = computed(()=>{return (dataIsPresent.value && isActive.value)})

    return {dataObject, connected, subscribeToFields, updateChildData, canUpdateChildData, dataIsPresent, mqttUtil, inputOptions, inputOptionsIsPresent}
  }
}

</script>

<style scoped>

</style>
