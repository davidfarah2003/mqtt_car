<template>
  <div class="plugin" v-if="initialized">
    <div class="label-button">
      <label>Change parameters</label>
      <b-button-group>
        <b-button @click="fcuModal = !fcuModal">FCU</b-button>
        <b-button @click="maxonModal = !maxonModal">Maxon</b-button>
        <b-button @click="battModal = !battModal"> Battery </b-button>
      </b-button-group>
    </div>

    <div class="label-button">
      <label>Raspberry</label>
      <b-button variant="danger" block="true" @click="mqttUtil.send('dahu/raspi','restart')">Restart</b-button>
    </div>

    <div class="label-button">
      <label>Configurations</label>
      <b-button block="true" @click="configModal=!configModal">Control</b-button>
    </div>

    <div class="label-button">
      <label>Maxon Clear Error</label>
      <b-button @click="['main','back','lat']
      .forEach((foil => mqttUtil.sendCommand(`${foil}_rxpdo_1`, [0b1000000000000000])))"
          variant="danger" block="true">Clear Error</b-button>
    </div>

    <div class="label-button">
      <label>Logging: {{!!dataObject["logging_state"][0]}}</label>
      <b-button-group block="true">
        <b-button variant="info" @click="mqttUtil.send('dahu/raspi', 'start_logging')">Start</b-button>
        <b-button variant="warning" @click="mqttUtil.send('dahu/raspi', 'stop_logging')">Stop</b-button>
      </b-button-group>
    </div>

    <div class="label-button">
      <label>Send Latest Log</label>
      <b-button-group block="true">
        <b-button variant="success" @click="mqttUtil.send('dahu/raspi', 'send_latest_log')">Send</b-button>
      </b-button-group>
    </div>

    <div>
      <b-alert show>alertLog</b-alert>
    </div>

    <b-modal v-model="fcuModal" modal-class="fcu-parameters-modal" hide-backdrop="false" title="FCU Parameters">
      <p>Select sub-system</p>
      <b-form-select></b-form-select>
      <b-form-select></b-form-select>
    </b-modal>

    <b-modal v-model="maxonModal" modal-class="maxon-modal" hide-backdrop="false" title="Config MAXON motor">
      <div class="row">
        <div class="col-sm-6 mb-3">
          <p class="mb-1">NMT operation</p>
          <b-button-group class="d-flex">
            <b-button @click="" variant="success">Start</b-button>
            <b-button @click="" variant="danger">Stop</b-button>
          </b-button-group>
        </div>

        <div class="col-sm-6">
          <p class="mb-1">FCU Calibration</p>
          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand('request_calibration', [1,1])" variant="success">Activate</b-button>
            <b-button @click="mqttUtil.sendCommand('request_calibration', [1,0])" variant="danger">Disable</b-button>
          </b-button-group>
        </div>
      </div>

      <b-tabs content-class="mt-3">
        <b-tab @click="activeFoil='back'" title="Rear foil" active></b-tab>
        <b-tab @click="activeFoil='main'" title="Main foil"></b-tab>
        <b-tab @click="activeFoil='lat'" title="Lateral foil"></b-tab>
        <b-tab @click="activeFoil='lat'" title="Benito"></b-tab>
      </b-tabs>

      <div class="row">
        <div class="col-sm-6">
          <p class="mt-2 mb-1">Maxon operation</p>
          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_1`, [0b0000011000000000])" variant="info">Activate</b-button>
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_1`, [0b0000111100000000])" variant="success">Enable</b-button>
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_1`, [0b0001111100000000])" variant="warning">Start</b-button>
          </b-button-group>

          <b-button-group class="d-flex mt-2">
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_1`, [0])" variant="danger">Stop</b-button>
          </b-button-group>

          <p class="mt-2 mb-1">Maxon mode</p>
          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_2`, [1, 0b0000111100000000])" variant="info">PPM</b-button>
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_2`, [6, 0b0000111100000000])" variant="info">Homing</b-button>
          </b-button-group>

          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand(`${activeFoil}_rxpdo_1`, [0b1000000000000000])" variant="danger">Clear error</b-button>
          </b-button-group>

          <p class="mt-2 mb-1">Homing</p>
          <b-button-group class="d-flex">
            <b-button @click="" variant="danger">Start Homing</b-button>

          </b-button-group>
          <p class="mt-2 mb-1">PID Config</p>
          <b-button-group class="d-flex">
            <b-button @click="maxonPID = !maxonPID">PID</b-button>
          </b-button-group>
        </div>
        <div class="col-sm-6" v-if="initialized">
          <p>
            Operating mode: {{foilData["opState"]}} <br />
            Motor Status: {{foilData["status"]}}<br />
            Error code : {{dataObject[`${activeFoil}_state`]["error_code"][0]}}<br />
            Homing : {{}} <br />
            <br />
            Current demand :
            {{dataObject[`${activeFoil}_current`]["current_demand_value"][0]}}
            {{dataObject[`${activeFoil}_current`]["current_demand_value"][1]}} <br />
            Velocity demand :
            {{dataObject[`${activeFoil}_velocity`]["velocity_demand_value"][0]}}
            {{dataObject[`${activeFoil}_velocity`]["velocity_demand_value"][1]}}<br />
            Position demand :
            {{dataObject[`${activeFoil}_position`]["position_demand_value"][0]}}
            {{dataObject[`${activeFoil}_position`]["position_demand_value"][1]}}<br />
            Position actual :
            {{dataObject[`${activeFoil}_position`]["position_actual_value"][0]}}
            {{dataObject[`${activeFoil}_position`]["position_actual_value"][1]}}
          </p>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="battModal" modal-class="battery-modal" hide-backdrop="false" title="Configure battery">
      <div class="row">
        <div class="col-sm-5">
          <p class="mb-1">High Power Load</p>
          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand('battery_cmd', [1,1])" variant="success">ON</b-button>
            <b-button @click="mqttUtil.sendCommand('battery_cmd', [1,0])" variant="danger">OFF</b-button>
          </b-button-group>

          <p class="mt-2 mb-1">High Power PV</p>
          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand('battery_cmd', [2,1])" variant="success">ON</b-button>
            <b-button @click="mqttUtil.sendCommand('battery_cmd', [2,0])" variant="danger">OFF</b-button>
          </b-button-group>

          <p class="mt-2 mb-1">Fan Speed: {{fanSpeed}}</p>
          <b-form-input
            type='range'
            class="form-control"
            placeholder="20"
            v-model=fanSpeed
          />
          <b-button-group class="d-flex">
            <b-button @click="mqttUtil.sendCommand('battery_cmd', [4,Number(fanSpeed)])" variant="info">Set</b-button>
          </b-button-group>

        </div>
      </div>
    </b-modal>

    <b-modal v-model="maxonPID" modal-class="pid-modal" title="Configure MAXON PID">
      <div class="row">
        <div class="col-sm-5">
          <p class="mt-2 mb-1">PID values</p>
          <b-button-group class="d-flex">
            <label class="mt-2 mb-1 mr-2">P: </label>
            <input
                type="text"
                class="form-control"
                placeholder="30"
            />
          </b-button-group>
          <b-button-group class="d-flex">
            <label class="mt-2 mb-1 mr-2">I: </label>
            <input
                type="text"
                class="form-control"
                placeholder="30"
            />
          </b-button-group>
          <b-button-group class="d-flex">
            <label class="mt-2 mb-1 mr-2">D: </label>
            <input
                type="text"
                class="form-control"
                placeholder="30"
            />
          </b-button-group>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="configModal" modal-class="configuration-modal" title="Configuration">
      <p class="mb-1">Tuning selector 0: All disable</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(0)" variant="danger">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 1: Joystick</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(1)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 2: Pot_2_: height</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(2)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 3: Pot_2: height + Joystick</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(3)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 4: Pot_2 : Pitch</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(4)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 5: Pot_2: Pitch + Joystick</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(5)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning selector 6: Roll only</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(6)" variant="danger">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 7: Roll + Joystick</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(7)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 8: Roll + pot_2: height</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(8)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 9: Roll + Pot_2: height + Joystick</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(9)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 10: Roll + Pot_2 : Pitch</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(10)" variant="primary">Select</b-button>
      </b-button-group>

      <p class="mb-1">Tuning Selector 11: Roll + Pot_2: pitch + Joystick</p>
      <b-button-group class="d-flex">
        <b-button @click="tuning(11)" variant="primary">Select</b-button>
      </b-button-group>
    </b-modal>

  </div>
</template>

<script>
import {computed, ref} from "vue";
import modal from "bootstrap/js/src/modal";


export default {
  name: "Ctrl_panel",
  computed: {
    modal() {
      return modal
    }
  },
  props: ['canUpdate', 'mqttUtil'],
  emits: ['subscribeToFields', 'updateData'],

  setup(props, {emit}) {
    let dataObject = ref({})
    let initialized = ref(false)

    const fcuModal = ref(false)
    const maxonModal = ref(false)
    const battModal = ref(false)
    const maxonPID = ref(false)
    const configModal = ref(false)
    const activeFoil = ref("back")
    const fanSpeed = ref(20)

    let requiredFields = {
      "logging_state" : "raspi/logging/logging_state",

      "main_state": "main_position_motor/txpdo_1/*",
      "main_position": "main_position_motor/txpdo_2/*",
      "main_velocity": "main_position_motor/txpdo_3/*",
      "main_current": "main_position_motor/txpdo_4/*",

      "back_state": "back_position_motor/txpdo_1/*",
      "back_position": "back_position_motor/txpdo_2/*",
      "back_velocity": "back_position_motor/txpdo_3/*",
      "back_current": "back_position_motor/txpdo_4/*",

      "lat_state": "lat_position_motor/txpdo_1/*",
      "lat_position": "lat_position_motor/txpdo_2/*",
      "lat_velocity": "lat_position_motor/txpdo_3/*",
      "lat_current": "lat_position_motor/txpdo_4/*",

    }

    emit("subscribeToFields", requiredFields)

    setInterval( ()=>{
      if (props.canUpdate) {
        emit("updateData", requiredFields, dataObject)
        if(!initialized.value) initialized.value = true
      }
    } , 1000)

    //@click="mqttUtil.sendCommand('cockpit_configuration', [69,42])"

    function tuning(state){props.mqttUtil.sendCommand('cockpit_configuration', [2,state])}

    /**
     * Return maxon's operating mode
     * @returns {string}
     */
    function getOperationMode(opModeValue){
      switch(opModeValue) {
        case 1:return "PPM";
        case 3:return "PVM";
        case 6:return "HMM";
        case 8:return "CSP";
        case 9:return "CSV";
        case 10:return "CST";
        default:return "Unknown";
      }
    }

    /**
     * Return the Maxon's status
     * @returns {string}
     */
    function getMaxonStatus(statusword) {
      if(!statusword) return "Unknown"
      else if((statusword & 0b0001111) === 0b0000000) {return "Disabled";}
      else if((statusword & 0b0001111) === 0b0000001) {return "Ready to switch on";}
      else if((statusword & 0b0001111) === 0b0000011) {return "Switched on";}
      else if((statusword & 0b0001111) === 0b0000111) {return "Operation enabled";}
      else if((statusword & 0b0001111) === 0b0001000) {return "Fault";}
      else if((statusword & 0b0001111) === 0b0001111) {return "Fault reaction";}
      else if((statusword & 0b0001111) === 0b0000111) {return "Quick stop";}
      else {return "Unknown";}
    }

    const foilData = computed(()=> {
      return {
        opState: getOperationMode(dataObject.value[`${activeFoil.value}_state`]["modes_of_operation_display"][0]),
        status: getMaxonStatus(dataObject.value[`${activeFoil.value}_state`]["statusword"][0]),
      }
    })

    return {dataObject, initialized, fcuModal, maxonModal, battModal, maxonPID, configModal, tuning, activeFoil, fanSpeed, foilData}
  }
}
</script>

<style scoped>
.plugin{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  overflow: hidden;
}

.label-button {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

b-button {

}

label {
  text-align: center;
  padding-bottom: 0.2rem;
  font-size: 0.8rem;
}
</style>