<template>
  <div class="nav_overview">
    <div v-for="(value, name, index) in values" class="nav_elem">
      {{name}} : {{value}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav_overview",
  props: ['name_value_mapping'],
  setup(props) {

    return {values: props.name_value_mapping}
  }

}
</script>

<style scoped>

.nav_overview {
  margin: auto;
  border: solid 1px var(--contours);

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 1rem;
  grid-gap: 1rem;

  width: fit-content;
  border-radius: 25px;
}

.nav_elem {
  margin: auto;

}

</style>