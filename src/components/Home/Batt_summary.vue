<template>
  <span class="plugin" v-if="initialized">
    <ul>
      <li>Max cell Temp: {{dataObject["bms_status"]["max_cell_temp"][0]}} {{dataObject["bms_status"]["max_cell_temp"][1]}}</li>
      <li>Min Cell Voltage: {{dataObject["bms_status"]["min_cell_voltage"][0]}} {{dataObject["bms_status"]["min_cell_voltage"][1]}}</li>
      <li>Max cell Voltage: {{dataObject["bms_status"]["max_cell_voltage"][0]}} {{dataObject["bms_status"]["max_cell_voltage"][1]}}</li>
      <li>BMS Temps: {{dataObject["bms_status"]["bms_temp_1"][0]}} {{dataObject["bms_status"]["bms_temp_1"][1]}},
                     {{dataObject["bms_status"]["bms_temp_2"][0]}} {{dataObject["bms_status"]["bms_temp_2"][1]}}</li>
      <li>Pack Voltage: {{dataObject["pack_info"]["pack_voltage"][0]}} {{dataObject["pack_info"]["pack_voltage"][1]}}</li>
      <li>Fan Duty: {{dataObject["pack_info"]["fan_duty"][0]}} {{dataObject["pack_info"]["fan_duty"][1]}}</li>
      <li>Pack Current: {{dataObject["pack_current"][0]}} {{dataObject["pack_current"][1]}}</li>
      <li></li>
    </ul>

  </span>


</template>

<script>
import {ref} from "vue";

export default {
  name: "Battery_summary",
  props: ['canUpdate'],
  emits: ['subscribeToFields', 'updateData'],

  setup(props, {emit}) {
    let dataObject = ref({})
    let initialized = ref(false)

    let requiredFields = {
      "bms_status": "battery/bms_status/*",
      "pack_info": "battery/pack_info/*",
      "pack_current": "battery/can_port_current_1/pack_current"
    }

    emit("subscribeToFields", requiredFields)

    setInterval( ()=>{
      if (props.canUpdate) {
        emit("updateData", requiredFields, dataObject)
        if(!initialized.value) initialized.value = true
      }
    } , 1000)

    return {dataObject, initialized}
  }
}
</script>

<style scoped>
.plugin {
  overflow: hidden;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  justify-content: space-around;
}

li {
  width: 50%;
}
</style>