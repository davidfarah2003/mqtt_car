<template>
  <span class="plugin">
    <ul>
      <li> <div>Broker connection:</div> <div :class="connected ? 'green': 'red'"/> </li>
      <li v-for="(values, fieldName) in dataObject">
        <div>{{fieldName}}:</div> <div :class="values[0]===0 ? 'green': 'red'"/>
      </li>
    </ul>
  </span>
</template>

<script>
import {ref, watch} from "vue";

export default {
  name: "Status_panel",
  props: ['canUpdate', 'connected'],
  emits: ['subscribeToFields', 'updateData'],

  setup(props, {emit}) {
    let dataObject = ref({})
    let initialized = ref(false)

    let requiredFields = {
      "Motor 1": "motor_controller_1/pwm/warnings",
      "Motor 2": "motor_controller_2/pwm/warnings",
      "Main foil": "main_position_motor/txpdo_1/statusword",
      "Back foil": "back_position_motor/txpdo_1/statusword",
      "Lat foil": "lat_position_motor/txpdo_1/statusword",
      "FCU": "fcu/status_01/general_status",
      "IMU": "imu/status_01/general_status",
      "Battery": "battery/pack_info/status",
      "Height Sensor": "fcu/height_sensor/height_sensor_status",
    }

    let connected = ref(props.connected)
    watch(()=>props.connected, ()=>{
      connected.value = props.connected
    })

    emit("subscribeToFields", requiredFields)

    setInterval( ()=>{
      if (props.canUpdate) {
        emit("updateData", requiredFields, dataObject)
        if(!initialized.value) initialized.value = true
      }
    } , 1000)

    return {dataObject, initialized, connected}
  }
}
</script>

<style scoped>
.green {
  background: green;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
}

.red {
  background: red;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
}

ul{
  display: flex;
  flex-direction: row;
  padding: 0;
  flex-wrap: wrap;
  justify-content: space-around;
  column-gap: 0.5rem;
  row-gap: 0.6rem;
  height: 100%;
}

li {
  display: grid;
  grid-template-columns: 1.5fr 0.5fr;
  gap: 0;
  width: 48%;
  text-align: center;
}

li div {
  margin: auto;
}

</style>