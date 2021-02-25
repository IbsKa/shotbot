<template>
  <div>
    <div class="lead my-4">Wohin soll's gehen?</div>
    <div v-for="place in places" v-bind:key="place" class="w-100">
      <b-link :to="{ name: 'new', params: { place: place } }">
        <b-button
          style="width: 85%"
          class="m-3 jaegerbg"
          variant="light"
          size="lg"
          >{{ place }}
        </b-button>
      </b-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: function () {
    return {
      places: ["Bar", "Bibliothek", "Küche", "Speisesaal", "Spiegelkabinett"],
    };
  },
  components: {},
};
</script>
