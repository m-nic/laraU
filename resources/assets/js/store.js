let table = {
    columns: [
        {key: 'id', label: 'ID', is_hidden: false},
        {key: 'name', label: 'Name', is_hidden: false},
        {key: 'email', label: 'Email', is_hidden: false},
        {key: 'role', label: 'Role', is_hidden: false},
        {key: 'skills', label: 'Skills', is_hidden: true},
    ],
    rows: [],
    actions: [
        {
            label: 'View',
            iconClass: 'fa fa-eye',
            cssClass: 'btn btn-sm btn-light',
            run: (user) => {
                store.runViewAction(user);
                store.showViewModal();
            }
        },
        {
            label: 'Edit',
            iconClass: 'fa fa-edit',
            cssClass: 'btn btn-sm btn-light',
            run: (user) => {
                store.setupEditUser(user);
                store.showUserModal();
            }
        },
        {
            label: 'Delete',
            iconClass: 'fa fa-trash',
            cssClass: 'btn btn-sm btn-light',
            run: function(user) {
                if (!this.isDisabled(user)) {
                    store.state.cUser = user;
                    store.showDeleteModal(user);
                }
            },
            isDisabled: (user) => {
                return parseInt(user['id']) === parseInt(store.loggedUserId);
            }
        },
    ]
};


export const store = {
    appRefs: null,

    loggedUserId: window.loggedUser && window.loggedUser.id,
    loggedUserRole: window.loggedUser && window.loggedUser.role.slice(),

    state: {
        table,

        formConfig: {},
        editFormErrors: {},

        cUser: {},
        cSkills: {},

        userForm: [],

        currentChart: {},

        addMode: false,

        userModalShow: false,
        deleteModalShow: false,

        is_loading: false,
        initialized: false,
    },

    loadingTimer: null,

    showLoading() {
        if (store.loadingTimer) {
            clearTimeout(store.loadingTimer);
        }

        if (!store.state.is_loading) {
            store.loadingTimer = setTimeout(() => {
                store.state.is_loading = true;
            }, 500)
        }
    },

    hideLoading() {
        if (store.loadingTimer) {
            clearTimeout(store.loadingTimer);
        }

        store.state.is_loading = false;
    },

    runViewAction(user) {
        store.state.cUser = user;
        store.state.currentChart = toChartData(user['skills'] || []);
    },

    setAddMode() {
        store.state.addMode = true;
    },

    showDeleteModal() {
        store.appRefs['confirm-modal'] && store.appRefs['confirm-modal'].show();
    },

    hideDeleteModal() {
        store.clearCurrentUser();
        store.appRefs['confirm-modal'] && store.appRefs['confirm-modal'].hide();
    },

    showUserModal() {
        store.appRefs['edit-modal'] && store.appRefs['edit-modal'].show();
    },

    hideUserModal() {
        store.clearCurrentUser();
        store.state.addMode = false;

        store.appRefs['edit-modal'] && store.appRefs['edit-modal'].hide();
    },

    showViewModal() {
        store.appRefs['view-modal'] && store.appRefs['view-modal'].show();
    },

    hideViewModal() {
        store.clearCurrentUser();
        store.appRefs['view-modal'] && store.appRefs['view-modal'].hide();
    },

    clearCurrentUser() {
        store.state.formConfig = {};
        store.state.editFormErrors = {};
        store.state.cSkills = {};
        store.state.cUser = [];
        store.state.addMode = false;
    },

    setupEditUser(user) {
        const cUser = _.omit(user, ['skills']);

        if (_.isEmpty(store.state.cUser)) {
            store.state.cUser = cUser;
        }

        if (_.isEmpty(store.state.cSkills)) {
            const lastSkills = _.last(user['skills'] || []);
            store.state.cSkills = lastSkills && lastSkills.value;
        }

        store.state.formConfig = makeFormConfig(cUser, store.state.cSkills)
    },

    addNewSkill(skillName) {
        if (_.isEmpty(store.state.cSkills)) {
            store.state.cSkills = {};
        }

        store.state.cSkills[skillName] = 0;

        store.setupEditUser(formToUser(store.state.formConfig));
    },
};

function formToUser(formConfig) {
    return formConfig
        .reduce((form, control) => {
            if (-1 === control.id.indexOf('skills')) {
                form[control.id] = control.value;
            }
            return form;
        }, {});
}

function makeFormConfig(user, skills) {
    let fields = [
        {
            id: 'name',
            label: 'Name',
            type: 'text',
            value: user['name'],
        },
        {
            id: 'email',
            label: 'Email',
            type: 'email',
            value: user['email'],
        },
        {
            id: 'role',
            label: 'Role',
            type: 'select',
            value: user['role'],
            options: [
                {label: 'Admin', value: 'admin'},
                {label: 'User', value: 'user'}
            ]
        },
        ...makeSkillControls(skills)
    ];

    if (store.state.addMode) {
        fields.splice(1, 0, {
            id: 'password',
            label: 'Password',
            type: 'text',
            value: user['password'],
            placeholder: 'Enter password',
        });
    }

    return fields;
}

function makeSkillControls(skills) {
    if (_.isEmpty(skills)) return [];

    return Object
        .keys(skills)
        .map((skillName) => ({
            id: `skills.${skillName}`,
            label: skillName,

            type: 'rate',
            is_removable: true,

            max: 5,
            value: skills[skillName] || 1,
            valueMap: getValueMap,

            remove() {
                delete skills[skillName];
                store.setupEditUser(
                    formToUser(store.state.formConfig)
                );
            },
        })
    );
}

function getValueMap(i) {
    return {
        1: 'Cunostinte pur teoretice doar, fara activitati practice.',
        2: 'Incepator, junior',
        3: 'Confirmat, cu mai multe proiecte la activ',
        4: 'Avansat, senior',
        5: 'Expert',
    }[i];
}

function toChartData(userSkills) {
    // get all skills datestamps
    const datestamps = _.map(userSkills, 'created_at');

    // get entire skill timeline values
    const timeline = _.map(userSkills, 'value');

    // get all existing skills
    const allSkills = _.uniq(
        _.flatMap(timeline, (set) => Object.keys(set))
    );

    // foreach skill check its value in the timeline

    const chartSeries = allSkills.map((skillName) => {
        return timeline.map((set) => {
            return set[skillName] || 0;
        })
    });

    return {
        visible: false,
        data: {
            labels: datestamps.map((time) => moment(time).format('DD-MM-YY hh:mm')),
            series: chartSeries,
        },
        options: {
            seriesBarDistance: 15,
            fullWidth: true,
            plugins: [
                Chartist.plugins.legend({
                    legendNames: allSkills.map((skill, i) => ({name: skill, series: [i]}))
                })
            ]
        }
    };

}
