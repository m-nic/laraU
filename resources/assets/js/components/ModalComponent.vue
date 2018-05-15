<template>
    <div class="modal fade" tabindex="-1" role="dialog" ref="modal-ref">
        <div class="modal-dialog" v-bind:class="modalCss" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <slot name="modal-title"></slot>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <slot name="modal-body"></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-on:click="runAction()" v-if="!hideSubmit">
                        <i class="fa fa-check"></i> Submit
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        props: ['hide-submit', 'modal-css'],

        methods: {
            show: function () {
                $(this.$refs['modal-ref']).modal('show');
            },
            hide: function () {
                $(this.$refs['modal-ref']).modal('hide');
            },
            runAction: function () {
                this.$emit('run-action');
            }
        },

        mounted() {
            $(this.$refs['modal-ref'])
                .on('shown.bs.modal', (e) => { this.$emit('shown', e); })
                .on('hidden.bs.modal', (e) => { this.$emit('hidden', e); })
        }
    }
</script>