import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
Vue.config.productionTip = false
// vee-validate
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
