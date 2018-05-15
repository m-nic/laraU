<template>
    <form v-on:submit="submit($event)">

        <template v-for="control of config">
            <hr v-if="control.has_delim">

            <div class="form-group" v-bind:class="groupCssClass(control)">

                <template v-if="-1 < ['button', 'submit'].indexOf(control.type)">
                    <button class="btn btn-default"
                            v-on:click="callAction(control)"
                            v-bind:type="control.type"
                            v-bind:disabled="isDisabled(control)"
                    >
                        {{ control.label }}
                    </button>
                </template>

                <template v-else>
                    <label class="control-label" v-bind:for="control.id">{{ control.label }}</label>

                    <template v-if="control.type === 'select'">
                        <select
                                class="form-control"
                                v-model="control.value"
                                v-bind:id="control.id"
                                v-bind:class="isInvalid(control)"
                                v-bind:disabled="isDisabled(control)"
                        >
                            <option v-bind:value="undefined">Choose ...</option>
                            <option v-for="option of control.options" v-bind:value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </template>

                    <template v-else-if="control.type === 'rate'">
                        <rate-component v-bind:control="control"></rate-component>
                    </template>

                    <template v-else>
                        <input class="form-control"
                               v-model="control.value"
                               v-bind:type="control.type"
                               v-bind:id="control.id"
                               v-bind:class="isInvalid(control)"

                               v-bind:placeholder="control.placeholder"
                               v-bind:disabled="isDisabled(control)"
                        >
                    </template>

                    <template v-if="control['is_removable']">
                        <button type="button" class="btn btn-link btn-remove" v-on:click="control.remove()">
                            <i class="fa fa-close"></i> Remove
                        </button>
                    </template>
                </template>
                <div class="invalid-feedback" v-if="isInvalid(control)">{{ errors[control.id].join('. ') }}</div>
            </div>
        </template>
    </form>
</template>

<script>
    Vue.component('rate-component', require('./RateComponent.vue'));

    export default {
        props: ['config', 'errors'],

        methods: {

            callAction(control) {
                if (control.action instanceof Function) {
                    control.action();
                }
            },

            isDisabled(control) {
                if (control.isDisabled instanceof Function) {
                    return control.isDisabled()
                }

                return false;
            },

            submit($event) {
                if ($event) $event.preventDefault();

                this.$emit(
                    'submit-form',
                    this.config.reduce((form, input) => {
                        if (input.id) {

                            if (-1 < input.id.indexOf('.')) {
                                _.set(form, input.id, input.value);
                            } else {
                                form[input.id] = input.value;
                            }
                        }
                        return form;
                    }, {})
                );
            },

            groupCssClass(control) {
                return 'control-' + (control.id && control.id.replace(/\..*/, ''));
            },

            isInvalid(control) {
                if (this.errors && this.errors[control.id]) {
                    return 'is-invalid';
                }
                return false;
            }
        },

    }
</script>