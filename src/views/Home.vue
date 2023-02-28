<template>
  {{dataObject}}
</template>

<script>

import {inject, ref} from "vue";
import mqttUtils from "@/composables/mqttUtils.mjs";

export default {
  name: "Home",
  components: {},
  setup(){
    let dataObject = ref({
      test: {
        test2 : 1
      }
    }
    )

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

    return {dataObject}
  }
}

</script>

<style scoped>

.app-main{
  display: grid;
  grid-template-columns: 0.9fr 1.1fr 1fr;
  column-gap: 13px;
  row-gap: 13px;
  margin: 0.5rem;

  height: 100%;
}

::v-deep(.card-title) {
  text-align: center;
  color: var(--title_color);
  font-size: 1.2rem;
}

.card {
  background: var(--primary-dark);
  height: 100%;
  box-shadow: 0 2px 10px 1px rgba(0,0,0,.8);
}

.status-panel {
  grid-column: 1;
  grid-row: 1;
}
.dashboard {
  grid-column: 2;
  grid-row: 1;
}
.ctrl-panel {
  grid-column: 3;
  grid-row: 1;
}
.batt-summ {
  grid-column: 1;
  grid-row: 2;
}


</style>
