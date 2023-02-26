<template>
  <span class="plugin" v-if="initialized">
    <div class="speedometers">
      <vue-speedometer
          :width="200"
          :height="150"
          :ringWidth="23"
          :needleHeightRatio="0.65"
          :maxSegmentLabels="0"
          :segments="50"
          :value = "dataObject['bridge_ahrs']['velocity_x'][0]"
          :minValue="0"
          :maxValue="30"
          :currentValueText="'Velocity: ${value} ' + dataObject['bridge_ahrs']['velocity_x'][1]"
          startColor="#3ca358"
          endColor="#a1283a"
          needleColor="#D8DEE9"
          textColor="white"
          valueTextFontSize="0.85rem"
      />

      <vue-speedometer
          :width="200"
          :height="150"
          :ringWidth="23"
          :needleHeightRatio="0.65"
          :maxSegmentLabels="0"
          :segments="5"
          :value = "dataObject['height'][0]"
          :minValue="0"
          :maxValue="3"
          :currentValueText="'Height: ${value} ' + dataObject['height'][1]"
          needleColor="#D8DEE9"
          textColor="white"
          valueTextFontSize="0.85rem"
          :customSegmentStops="[0, 0.5, 1, 2, 2.5, 3]"
          :segmentColors='["#a1283a", "#d08770", "#3ca358", "#d08770", "#a1283a"]'
      />
    </div>

    <ul>
      <li>Yaw Rate: {{dataObject["bridge_ahrs"]["yaw_rate"][0]}} {{dataObject["bridge_ahrs"]["yaw_rate"][1]}}</li>
      <li>Roll: {{dataObject["bridge_ahrs"]["roll"][0]}} {{dataObject["bridge_ahrs"]["roll"][1]}}</li>
      <li>Pitch: {{dataObject["bridge_ahrs"]["pitch"][0]}} {{dataObject["bridge_ahrs"]["pitch"][1]}}</li>
      <li>Latitude: {{dataObject["ekf_position"]["latitude"][0]}} {{dataObject["ekf_position"]["latitude"][1]}}</li>
      <li>Longitude: {{dataObject["ekf_position"]["longitude"][0]}} {{dataObject["ekf_position"]["longitude"][1]}}</li>
      <li>Heading: {{dataObject["yaw"][0]}} {{dataObject["yaw"][1]}}</li>
    </ul>

  </span>
</template>

<script>
import {ref} from "vue";
import VueSpeedometer from 'vue-speedometer'

export default {
  name: "Dashboard",
  props: ['canUpdate', 'connected'],
  emits: ['subscribeToFields', 'updateData'],
  components: {VueSpeedometer,},

  setup(props, {emit}) {
    let dataObject = ref({})
    let initialized = ref(false)

    //fields to request update
    let requiredFields = {
      "height" : "fcu/height_sensor/height_measure",
      "bridge_ahrs" : "fcu/bridge_ahrs/*",
      "ekf_position" : "imu/ekf_position/*",
      "yaw" : "imu/ekf_euler_accuracy/yaw_acc",
    }
    emit("subscribeToFields", requiredFields)

    //update intervals for plugin
    setInterval( ()=>{
      if (props.canUpdate) {
        emit("updateData", requiredFields, dataObject)
        if(!initialized.value) initialized.value = true
      }
    } , 500)

    return {dataObject, initialized}
  }
}
</script>

<style scoped>
.plugin {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: space-around;
  height: 100%;
}

.speedometers {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0;
}

ul {
  list-style: none;
  display: flex;
  row-gap: 0.7rem;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0;
}
li {
  text-align: center;
  width: 33%;
  font-size: 1rem;
}
</style>