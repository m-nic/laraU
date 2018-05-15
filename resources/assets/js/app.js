/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('table-component', require('./components/TableComponent.vue'));
Vue.component('modal-component', require('./components/ModalComponent.vue'));
Vue.component('form-component', require('./components/FormComponent.vue'));
Vue.component('chart-component', require('./components/ChartComponent.vue'));

import {store} from './store';
import {service} from './service';

service.store = store;

const addSkillFormConfig = [
    {
        id: 'new_skill',
        type: 'text',
        label: '',
        placeholder: 'Enter new skill',
        has_delim: true,
    },
    {
        type: 'submit',
        label: 'Add new skill',
        isDisabled: () => _.isEmpty(addSkillFormConfig[0].value)
    }
];

new Vue({
    el: '#app',
    data: {
        state: store.state,
        addSkillForm: addSkillFormConfig,
    },

    methods: {
        shoNewUserModal() {
            store.setAddMode();
            store.setupEditUser({});
            store.showUserModal();
        },

        performUpdate(formValues) {
            if (store.state.addMode) {
                service.createUser(formValues);
            } else {
                service.updateUser(store.state.cUser.id, formValues)
            }
        },

        performRemove() {
            service.removeUser(store.state.cUser.id);
        },

        addSkill(form) {
            store.addNewSkill(form['new_skill']);
            addSkillFormConfig[0].value = '';
        },

        viewModalShown() {
            this.$refs['view-chart'].$refs['chart-ref'].renderChart();
            store.state.currentChart.visible = true;
        },
        viewModalHidden() {
            store.state.currentChart = {};
        },

        editModalHidden() {
            store.clearCurrentUser();
            addSkillFormConfig[0].value = '';
        },
    },

    created() {
        switch (store.loggedUserRole) {
            case 'admin':
                service.loadUsers();
                break;

            case 'user':
                service.getCurrentUser();
                break;
        }
    },

    mounted() {
        store.state.initialized = true;
        store.appRefs = this.$refs;
    }

});
