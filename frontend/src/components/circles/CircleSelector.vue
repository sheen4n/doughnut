<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <BrandBar />
  </nav>
  <LoadingPage v-bind="{ contentExists: circles, title: 'My Circles' }">
    <div v-if="!!circles">
      <ul class="list-group">
        <li class="list-group-item">
          <router-link :to="{ name: 'notebooks' }"> My Notebooks </router-link>
        </li>
        <li class="list-group-item">
          <router-link :to="{ name: 'bazaar' }"> Bazaar </router-link>
        </li>
        <li class="list-group-item" v-for="circle in circles" :key="circle.id">
          <router-link
            :to="{ name: 'circleShow', params: { circleId: circle.id } }"
          >
            {{ circle.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="btn-group">
      <PopButton class="btn btn-secondary" title="Create a new circle">
        <CircleNewDialog />
      </PopButton>
      <router-link class="btn btn-primary" :to="{ name: 'circleJoin' }">
        Join a circle
      </router-link>
    </div>
  </LoadingPage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoadingPage from "@/pages/commons/LoadingPage.vue";
import useLoadingApi from "../../managedApi/useLoadingApi";
import PopButton from "../commons/Popups/PopButton.vue";
import CircleNewDialog from "./CircleNewDialog.vue";
import BrandBar from "../toolbars/BrandBar.vue";

export default defineComponent({
  setup() {
    return useLoadingApi();
  },
  data() {
    return {
      circles: null as Generated.Circle[] | null,
    };
  },
  methods: {
    fetchData() {
      this.api.circleMethods.getCirclesOfCurrentUser().then((res) => {
        this.circles = res;
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  components: {
    PopButton,
    CircleNewDialog,
    LoadingPage,
    BrandBar,
  },
});
</script>
