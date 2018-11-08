import Vue from 'vue'
import {HttpMethods} from './index'
declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpMethods
  }
  interface VueConstructor {
    http: HttpMethods
  }
}