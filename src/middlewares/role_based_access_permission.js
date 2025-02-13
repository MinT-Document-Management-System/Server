const RBAC = {
    user: {
        // anyone: ['login', 'reset_password', 'check_user_email', 'forget_password_send_otp', 'forget_password'],   // Already hadndled by exclusion of any middleware for this paths
        general: ['get_user_data']  // All except the it & admin.
    },
    letter: {
        general: ['upload_letter', 'get_letter', 'get_all_letters', 'upload_letter_version', 'request_letter_deletion'], // it has no access
        department_head: ['grant_access', 'revoke_access'],
    },
    role: {
        general: ['get_role_by_id', 'get_all_roles'], // staff, department_head, record_official
    },
    department: {
        general: ['get_all_departments', 'get_department_details'],
        it: ['add_department', 'delete_department', 'get_user_count_by_department']
    }
}

module.exports = RBAC