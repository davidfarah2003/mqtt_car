<template>
  <section>
    <div class="form-box">
      <Joystick
          :style="{margin: '20px',}"
          @move="move"
          @start="start"
          @stop="stop"
          :size="120"
          :stickSize="45"
          :throttle="100"
          :disabled="false"
          :sticky="false"
          :followCursor="false"
          stickImage="https://media.istockphoto.com/id/1419117748/photo/old-wall-texture-cement-dirty-gray-with-black-background-abstract-grey-and-silver-color.jpg?b=1&s=170667a&w=0&k=20&c=KI-m7WiMl2YDY5nSyAxxsta5ZPwjY1x6WwSCRdZq-VA="
          baseImage="https://texturelabs.org/wp-content/uploads/Texturelabs_Grunge_239thumbnail.jpg"
      />
      <Joystick
          :style="{margin: '20px',}"
          @move="move"
          @start="start"
          @stop="stop"
          :size="120"
          :stickSize="45"
          :throttle="100"
          :disabled="false"
          :sticky="false"
          :followCursor="false"
          stickImage="https://media.istockphoto.com/id/1419117748/photo/old-wall-texture-cement-dirty-gray-with-black-background-abstract-grey-and-silver-color.jpg?b=1&s=170667a&w=0&k=20&c=KI-m7WiMl2YDY5nSyAxxsta5ZPwjY1x6WwSCRdZq-VA="
          baseImage="https://texturelabs.org/wp-content/uploads/Texturelabs_Grunge_239thumbnail.jpg"
      />
    </div>
  </section>
</template>

<script>

import {inject, ref} from "vue";
import mqttUtils from "@/composables/mqttUtils.mjs";
import {Joystick} from "vue-joystick-component";

export default {
  name: "Home",
  components: {Joystick},

  setup(){
    let dataObject = ref({
      current_speed : 0,
      current_rotation : 0,
    })

    updateDataObject("test/test2", 2)

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

    const start = () => console.log('start')
    const stop = () => console.log('stop')
    const move = ({ x, y, direction, distance }) => {
      console.log('move', { x, y, direction, distance })
    }

    return {dataObject, stop, start, move}
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;

  background: url("@/assets/wallpaper2.jpg") no-repeat center;
  background-size: cover;
}
.form-box{
  position: relative;
  width: 80%;
  height: 50%;

  min-height: 250px;
  min-width: 400px;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);

  display: flex;
  justify-content: space-around;
  align-items: center;

  margin-top: 30%;
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
</style>
