<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listUsers, updateUserProfile } from '@/services/admin/users.admin.service';
import type { UserProfile } from '@/services/admin/users.admin.service';

document.title = 'Manajemen Pengguna';

const users = ref<UserProfile[]>([]);
const loading = ref(true);
const editingId = ref<string | null>(null);
const editRole = ref('');
const saving = ref(false);

async function fetchUsers() {
  loading.value = true;
  try { users.value = await listUsers(); } catch (e) { console.error(e); } finally { loading.value = false; }
}

function startEdit(user: UserProfile) {
  editingId.value = user.id;
  editRole.value = user.role;
}

function cancelEdit() { editingId.value = null; }

async function saveRole(id: string) {
  saving.value = true;
  try {
    await updateUserProfile(id, { role: editRole.value });
    editingId.value = null;
    fetchUsers();
  } catch (e) { console.error(e); } finally { saving.value = false; }
}

async function toggleActive(user: UserProfile) {
  try {
    await updateUserProfile(user.id, { is_active: !user.is_active });
    fetchUsers();
  } catch (e) { console.error(e); }
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

onMounted(fetchUsers);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Manajemen Pengguna</h1>
      <p class="text-small text-[var(--color-moss)]">User baru dibuat via Supabase Dashboard → Authentication → Users</p>
    </div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <div v-else-if="users.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada pengguna</div>

    <div v-else class="overflow-hidden rounded-xl border border-[var(--color-sand)] bg-white">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-small">
          <thead>
            <tr class="border-b border-[var(--color-sand)] bg-[var(--color-cream)]">
              <th class="px-4 py-3 font-semibold text-[var(--color-bark)]">Nama</th>
              <th class="px-4 py-3 font-semibold text-[var(--color-bark)]">Role</th>
              <th class="px-4 py-3 font-semibold text-[var(--color-bark)]">Status</th>
              <th class="px-4 py-3 font-semibold text-[var(--color-bark)]">Dibuat</th>
              <th class="px-4 py-3 font-semibold text-[var(--color-bark)]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-[var(--color-sand)] last:border-b-0">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img v-if="user.avatar_url" :src="user.avatar_url" class="h-8 w-8 rounded-full object-cover" />
                  <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-sage)] text-xs font-medium text-white">
                    {{ (user.full_name || 'A').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-body text-[var(--color-bark)]">{{ user.full_name || '(tanpa nama)' }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <template v-if="editingId === user.id">
                  <div class="flex items-center gap-2">
                    <select v-model="editRole" class="rounded-lg border border-[var(--color-sand)] bg-white px-2 py-1 text-small text-[var(--color-bark)]">
                      <option value="editor">Editor</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    <button :disabled="saving" class="rounded bg-[var(--color-forest)] px-2 py-1 text-xs text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="saveRole(user.id)">
                      {{ saving ? '...' : 'Simpan' }}
                    </button>
                    <button class="rounded px-2 py-1 text-xs text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="cancelEdit">Batal</button>
                  </div>
                </template>
                <template v-else>
                  <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', user.role === 'super_admin' ? 'bg-[var(--color-forest)]/10 text-[var(--color-forest)]' : 'bg-[var(--color-sand)] text-[var(--color-bark)]']">
                    {{ user.role === 'super_admin' ? 'Super Admin' : 'Editor' }}
                  </span>
                </template>
              </td>
              <td class="px-4 py-3">
                <button
                  :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']"
                  @click="toggleActive(user)"
                >
                  <span :class="['h-1.5 w-1.5 rounded-full', user.is_active ? 'bg-green-500' : 'bg-red-500']" />
                  {{ user.is_active ? 'Aktif' : 'Nonaktif' }}
                </button>
              </td>
              <td class="px-4 py-3 text-[var(--color-moss)]">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-3">
                <button v-if="editingId !== user.id" class="text-[var(--color-forest)] hover:underline" @click="startEdit(user)">Edit Role</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
