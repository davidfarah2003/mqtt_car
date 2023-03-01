<template>



  <section>

    <div class="live_info_box box_container">
      <vue-speedometer
          :width="width > 1000 ? 200: 150"
          :height="width > 1000 ? 150: 105"
          :ringWidth="width > 1000 ? 23: 10"
          :needleHeightRatio="width > 1000 ? 0.65: 0.55"

          :maxSegmentLabels="0"
          :segments="50"
          :needleTransitionDuration="200"
          :value = "dataObject.current_throttle"
          :minValue="-100"
          :maxValue="100"
          :currentValueText="'Throttle: ${value} %'"
          startColor="#3ca358"
          endColor="#a1283a"
          needleColor="#D8DEE9"
          textColor="white"
          valueTextFontSize="0.85rem"
      />
    </div>

    <div class="live_info_box box_container">
      <vue-speedometer
          :width="width > 1000 ? 200: 150"
          :height="width > 1000 ? 150: 105"
          :ringWidth="width > 1000 ? 23: 10"
          :needleHeightRatio="width > 1000 ? 0.65: 0.55"

          :maxSegmentLabels="0"
          :needleTransitionDuration="200"
          :segments="5"
          :value = "dataObject.current_rotation"
          :minValue="-30"
          :maxValue="30"
          :currentValueText="'Angle: ${value} DEG'"
          needleColor="#D8DEE9"
          textColor="white"
          valueTextFontSize="0.85rem"
          :customSegmentStops="[-30, -20, -10, 10, 20, 30]"
          :segmentColors='["#a1283a", "#d08770", "#3ca358", "#d08770", "#a1283a"]'
      />
    </div>


    <div class="joysticks box_container">

      <div class="joystick">
        <p>Throttle</p>
        <Joystick
            :style="{margin: '0px',}"
            @move="move_throttle"
            @stop="stop_throttle"
            :size="120"
            :stickSize="40"
            :throttle="40"
            :disabled="false"
            :sticky="false"
            :followCursor="false"
            stickImage="https://media.istockphoto.com/id/1419117748/photo/old-wall-texture-cement-dirty-gray-with-black-background-abstract-grey-and-silver-color.jpg?b=1&s=170667a&w=0&k=20&c=KI-m7WiMl2YDY5nSyAxxsta5ZPwjY1x6WwSCRdZq-VA="
            baseImage="https://texturelabs.org/wp-content/uploads/Texturelabs_Grunge_239thumbnail.jpg"
        />
      </div>

      <div class="joystick">
        <p>Steering</p>
        <Joystick
            :style="{margin: '0px',}"
            @move="move_direction"
            @stop="stop_direction"
            :size="120"
            :stickSize="40"
            :throttle="40"
            :disabled="false"
            :sticky="false"
            :followCursor="false"
            aria-label="TEST"
            stickImage="https://media.istockphoto.com/id/1419117748/photo/old-wall-texture-cement-dirty-gray-with-black-background-abstract-grey-and-silver-color.jpg?b=1&s=170667a&w=0&k=20&c=KI-m7WiMl2YDY5nSyAxxsta5ZPwjY1x6WwSCRdZq-VA="
            baseImage="https://texturelabs.org/wp-content/uploads/Texturelabs_Grunge_239thumbnail.jpg"
        />
      </div>
    </div>

  </section>
</template>
<script>

import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import mqttUtils from "@/composables/mqttUtils.mjs";
import {Joystick} from "vue-joystick-component";
import VueSpeedometer from "vue-speedometer";
import {round} from "@popperjs/core/lib/utils/math";

export default {
  name: "Home",
  components: {Joystick, VueSpeedometer},

  setup(){

    let windowWidth = ref(window.innerWidth)
    const onWidthChange = () => windowWidth.value = window.innerWidth
    onMounted(() => window.addEventListener('resize', onWidthChange))
    onUnmounted(() => window.removeEventListener('resize', onWidthChange))
    const width = computed(() => windowWidth.value)

    let dataObject = ref({
      current_throttle : 0,
      current_rotation : 0,
    })

    updateDataObject("current_speed", 2)

    /**
     * Create an mqttUtils instance with arguments the client and a callback to update data
     * @type {MqttUtils}
     */
    const mqttUtil = new mqttUtils(inject('mqttClient'), (topic, message) => {updateDataObject(topic, message)})

    function updateDataObject(topic, message){
      const parts = topic.split('/');
      const limit = parts.length - 1;
      let object = dataObject.value;

      for (let i = 0; i < limit; ++i) {
        const key = parts[i];
        object = object[key] ?? (object[key] = { });
      }
      const key = parts[limit];
      object[key] = message;
    }

    let base = "mqttcar/"
    const stop_throttle = () => {
      dataObject.value.current_throttle=0
      mqttUtil.send(base+"set_throttle", "0")
    }
    const move_throttle = ({ x, y, direction, distance }) => {
      dataObject.value.current_throttle = round(y*100)
      mqttUtil.send(base+"set_throttle", `${round(y*100)}`)
    }
    const stop_direction = () => {
      dataObject.value.current_rotation=0
      mqttUtil.send(base+"set_angle", "0")
    }
    const move_direction = ({ x, y, direction, distance }) => {
      dataObject.value.current_rotation = round(x*30)
      mqttUtil.send(base+"set_angle", `${round(x*30)}`)
    }

    return {dataObject, width, stop_throttle, move_throttle, stop_direction, move_direction}
  }
}

</script>

<style scoped>

*{
  margin: 0;
  padding: 0;
}

section{
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  min-height: 100vh;
  width: 100%;

  object-fit: cover;
  background: url("@/assets/wallpaper2.jpg") no-repeat center;

  background-size: cover;
}

.box_container {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);
}

.joysticks{
  position: absolute;

  width: 90%;
  height: 54vh;
  min-height: 35vh;
  min-width: 200px;

  display: flex;
  justify-content: space-around;
  align-items: center;

  margin-top: 44vh;
}

.joystick {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  row-gap: 0.5rem;
}

.joystick p {
  font-size: 0.9rem;
  font-style: italic;
}

.live_info_box{
  height: fit-content;
  margin-top: 3vh;
}

@media only screen and (min-width: 1000px) {
  *{
    margin: 0;
    padding: 0;
    font-size: 15px;
  }

  section{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    min-height: 100vh;
    width: 100%;

    object-fit: cover;
    background: url("@/assets/wallpaper2.jpg") no-repeat center;

    background-size: cover;
  }

  .box_container {
    background: transparent;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 20px;
    backdrop-filter: blur(15px);
  }

  .live_info_box{
    margin-bottom: 20%;
  }

  .joysticks{
    position: absolute;

    width: 70%;
    height: 30%;
    min-height: 250px;
    min-width: 400px;

    display: flex;
    justify-content: space-around;
    align-items: center;

    margin-top: 40vh;
  }

  .joystick {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    row-gap: 1rem;
  }

  .joystick p {
    font-size: 1.1rem;
    font-style: italic;
  }

  button{
    width: 100%;
    height: 40px;
    border-radius: 40px;
    background: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
  }
}


</style>
