import Vue from 'vue'
declare module 'vue/types/vue' {
  interface Vue {
    $http: TypesInterface.Http
  }
  interface VueConstructor {
    http: TypesInterface.Http
  }
}