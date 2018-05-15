export const service = {
    store: {},

    getCurrentUser() {
        service.store.showLoading();

        return axios
            .get('/api/user/current')
            .then((response) => {
                service.store.runViewAction(response.data);
                service.store.state.currentChart.visible = true;

                service.store.hideLoading();
            })
            .catch(errorHandler);
    },

    loadUsers() {
        service.store.showLoading();

        return axios
            .get('/api/users')
            .then((response) => {
                service.store.state.table.rows = response.data;
                service.store.hideLoading();
            })
            .catch(errorHandler);
    },

    createUser(formData) {
        const userName = _.escape(formData['name']);

        service.store.showLoading();

        return axios
            .post(`/api/user`, formData)
            .then((response) => {
                if (response.data.errors) {
                    service.store.state.editFormErrors = response.data.errors;
                    service.store.hideLoading();
                } else {
                    service.store.hideUserModal();
                    service.loadUsers(); // this will hide loading

                    notify('success', `User '${userName}' was successfully created`);
                }
            })
            .catch((error) => {
                service.store.hideUserModal();
                errorHandler(error);

            })
    },

    updateUser(id, formData) {
        if (!id) {
            console.warn('Cannot perform update. User id not set');
            return;
        }

        const userName = _.escape(formData['name']);

        service.store.showLoading();

        return axios
            .put(`/api/user/${id}`, formData)
            .then((response) => {
                if (response.data.errors) {
                    service.store.state.editFormErrors = response.data.errors;
                    service.store.hideLoading();
                } else {
                    service.store.hideUserModal();
                    service.loadUsers(); // this will hide loading

                    notify('success', `User '${userName}' was successfully updated`);
                }
            })
            .catch((error) => {
                service.store.hideUserModal();
                errorHandler(error);
            });
    },

    removeUser(id) {
        if (!id) {
            console.warn('Cannot perform remove. User id not set');
            return;
        }

        service.store.showLoading();

        let userName = _.escape(service.store.state.cUser.name);

        return axios
            .delete(`/api/user/${id}`)
            .then(() => {
                service.store.hideDeleteModal();
                service.loadUsers();

                notify('success', `User '${userName}' was successfully removed`);
            })
            .catch((error) => {
                service.store.hideDeleteModal();
                errorHandler(error);
            })
    },
};


function errorHandler(error) {
    const errorData = _.escape(error.response && error.response.data);
    service.store.hideLoading();

    notify(
        'danger',
        'A server error has occurred.' +
        (
            errorData.error
                ? `<br><b>Detail:</b>&nbsp;<i>${errorData.error}</i>`
                : ''
        )
    );

}

function notify(type, message) {
    setTimeout(() => {
        $('[data-notify="container"]').remove();
        $.notify({message}, {type});
    }, 50);
}
