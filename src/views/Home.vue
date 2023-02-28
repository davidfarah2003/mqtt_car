<template>

</template>

<script>

export default {
  name: "Home",
  components: {},
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
