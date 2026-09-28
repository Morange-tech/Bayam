import api from '@/lib/api'

// Real backend calls (unlike the rest of lib/data/*, still on mock data) —
// staff accounts need a genuine restricted Sanctum login, see CLAUDE.md.

export async function fetchStaff() {
  const { data } = await api.get('/admin/staff')
  return data.data
}

export async function createStaff({ firstName, lastName, email, password, staffRole }) {
  const { data } = await api.post('/admin/staff', {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    staff_role: staffRole,
  })
  return data
}

export async function deleteStaff(id) {
  await api.delete(`/admin/staff/${id}`)
}
