<template>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th v-for="column of visibleCols">
                        {{ column.label }}
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!table.rows.length">
                    <td class="text-center" v-bind:colspan="visibleCols.length + 1">
                        No users around
                    </td>
                </tr>

                <template v-for="row of table.rows">
                    <tr>
                        <td v-for="column of visibleCols" v-bind:class="'column-' + column.key">
                            {{ row[column.key] }}
                        </td>
                        <td class="column-actions">
                            <template v-for="action of table.actions">
                                <button v-bind:class="action.cssClass"
                                        v-bind:disabled="isDisabled(action, row)"
                                        v-on:click="action.run(row)"
                                >
                                    <i v-bind:class="action.iconClass"></i> {{ action.label }}
                                </button> &nbsp;
                            </template>
                        </td>
                    </tr>
                </template>
            </tbody>

        </table>
    </div>
</template>

<script>
    export default {
        props: ['table'],
        methods: {
            isDisabled(action, row) {
                return action.isDisabled && action.isDisabled(row)
            }
        },
        computed: {
            visibleCols() {
                return this.table.columns
                    .filter((column) => !column.is_hidden)
            }
        }
    }
</script>
