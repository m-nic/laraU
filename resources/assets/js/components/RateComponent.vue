<template>
    <div>
        <template v-for="i of getRange()">
            <button type="button"

                    class="rating-btn btn btn-xs"
                    v-bind:class="{ 'btn-warning': i <= currentValue, 'btn-default': i > currentValue }"

                    v-on:click="setValue(i)"
                    v-bind:title="extraText(control, i)"
                    data-toggle="tooltip"
                    data-placement="top"
                    data-trigger="hover"
            >
                <i class="fa fa-star" v-bind:style="{'color': i <= currentValue ? '#fff' : '#000'}"></i>
            </button>
        </template>
        <div v-if="hasValueMap(control)" class="form-text text-muted">{{ extraText(control, currentValue) }}</div>
    </div>
</template>

<script>
    export default {
        props: ['control'],

        data: () => ({
            currentValue: 0,
        }),

        methods: {
            getRange() {
                return _.range(1, 1 + this.control.max);
            },

            setValue(i) {
                this.control['value'] = i;
                this.currentValue = i;
            },

            hasValueMap(control) {
                return control.valueMap instanceof Function;
            },

            extraText(control, value) {
                if (this.hasValueMap(control)) {
                    return control.valueMap(value);
                }
                return '';
            }
        },

        mounted() {
            this.currentValue = this.control.value;
            $('.rating-btn').tooltip()
        },
    }
</script>

<style>
    .rating-btn {
        margin: 0 1px;
    }
</style>
