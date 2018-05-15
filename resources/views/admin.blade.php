<table-component v-bind:table="state.table"></table-component>

<modal-component
        ref="edit-modal"
        v-on:run-action="$refs['edit-form'].submit()"
        v-on:hidden="editModalHidden($event)"
>

    <div slot="modal-title">
        <template v-if="state.addMode">
            Add new user
        </template>
        <template v-else>
            Edit user <b>@{{ state.cUser.name }}</b>
        </template>
    </div>

    <div slot="modal-body">
        <form-component
                ref="edit-form"
                v-bind:config="state.formConfig"
                v-bind:errors="state.editFormErrors"
                v-on:submit-form="performUpdate($event)"
        >

        </form-component>

        <form-component
                ref="add-skill"
                v-bind:config="addSkillForm"
                v-on:submit-form="addSkill($event)"
        >

        </form-component>
    </div>
</modal-component>

<modal-component ref="confirm-modal" v-on:run-action="performRemove()">
    <div slot="modal-title">Confirm removal</div>
    <div slot="modal-body">
        Are you sure you want to remove @{{ state.cUser.role }} <b>@{{ state.cUser.name }}</b>?
    </div>
</modal-component>

<modal-component
        ref="view-modal"
        v-bind:hide-submit="true"
        v-bind:modal-css="'modal-lg'"
        v-on:shown="viewModalShown($event)"
        v-on:hidden="viewModalHidden($event)"
>

    <div slot="modal-title"><b>@{{ state.cUser.name }}</b>'s skills</div>
    <div slot="modal-body">
        <chart-component ref="view-chart" v-bind:chart="state.currentChart"></chart-component>
    </div>
</modal-component>
