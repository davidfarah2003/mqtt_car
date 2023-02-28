<template>
  <section>
    <div class="form-box">
      <Joystick
          :style="{margin: '50px',}"
          @move="move"
          @start="start"
          @stop="stop"
          :size="146"
          :stickSize="64"
          stickColor="orange"
          :throttle="255"
          :disabled="false"
          :sticky="false"
          :followCursor="false"
          baseColor="grey"
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
  width: 400px;
  height: 450px;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;

}
h2{
  font-size: 2em;
  color: #fff;
  text-align: center;
}
.inputbox{
  position: relative;
  margin: 30px 0;
  width: 310px;
  border-bottom: 2px solid #fff;
}
.inputbox label{
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  color: #fff;
  font-size: 1em;
  pointer-events: none;
  transition: .5s;
}
input:focus ~ label,
input:valid ~ label{
  top: -5px;
}
.inputbox input {
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1em;
  padding:0 35px 0 5px;
  color: #fff;
}
.inputbox ion-icon{
  position: absolute;
  right: 8px;
  color: #fff;
  font-size: 1.2em;
  top: 20px;
}
.forget{
  margin: -15px 0 15px ;
  font-size: .9em;
  color: #fff;
  display: flex;
  justify-content: space-between;
}

.forget label input{
  margin-right: 3px;

}
.forget label a{
  color: #fff;
  text-decoration: none;
}
.forget label a:hover{
  text-decoration: underline;
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
.register{
  font-size: .9em;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}
.register p a{
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}
.register p a:hover{
  text-decoration: underline;
}

</style>
