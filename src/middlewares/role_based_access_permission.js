const RBAC = {
    user: {
        general: [],
        staff: [],
        department_head: [],
        record_official: []
    },
    letter: {
        general: [],
        staff: [],
        department_head: [],
        it: [],
    },
    role: {
        general: [], // staff, department_head, record_official
    },
    department: {
        general: [],
    }
}

module.exports = RBAC