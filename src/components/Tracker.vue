<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  tracked: {
    type: Array,
    default: () => [],
  },
});

function confirmUntrack(domain) {
  const userConfirmed = window.confirm(
    `Are you sure you want to untrack "${domain}"?`
  );
  if (userConfirmed) {
    emit("untrackDomain", domain);
  }
}

function formatDate(dateString) {
  if (!dateString || dateString === "N/A") return "N/A";
  const dateOnly = new Date(dateString).toISOString().split("T")[0];
  return dateOnly;
}

const emit = defineEmits(["untrackDomain", "updateEmail", "manualNotify"]);
</script>

<template>
  <div class="container-3 flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <h3><b>Expiry Tracker</b></h3>
    <table v-if="tracked.length" class="table-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
      <thead>
        <tr>
          <th>Sr.</th>
          <th>Domain</th>
          <th>Email</th>
          <th>Expiry</th>
          <th>Days Left</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in tracked" :key="item.domain">
          <td>{{ idx + 1 }}</td>
          <td class="dname">{{ item.domain }}</td>
          <td class="dmail">
            <input
              type="email"
              v-model="item.email"
              @change="
                emit('updateEmail', { domain: item.domain, email: item.email })
              "
              class="email-input"
              placeholder="Enter email"
            />
          </td>
          <td class="expdate">{{ formatDate(item.expiryDate) }}</td>
          <td class="renewday">{{ item.daysLeft }}</td>
          <td :class="item.status === 'Expired' ? 'expired' : 'active'">
            {{ item.status }}
          </td>
          <td>
            <button
              @click="confirmUntrack(item.domain)"
              class="track-untrack-button"
            >
              Untrack
            </button>
          </td>
          <td>
            <button
              @click="emit('manualNotify', item)"
              class="track-notify-button"
            >
              Notify
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <em>No tracked domains.</em>
    </div>
  </div>
</template>

<style scoped>
.h3 {
  text-align: center;
  color:#2563eb;
  font-size:20px;

}
.table {
  display:block;
  margin:auto;
  padding:15px;
}

.track-untrack-button {
  background-color: #bb4848;
  color: #1d1e1f;
  cursor: pointer;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
  margin: 4px 0;
}

.container-3 {
  display: block;
  margin: 0 auto;
  width: 100% !important;
  margin-top: 10px;
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.track-notify-button {
  background-color: #c0be4a;
  color: #1d1e1f;
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.dname {
  color: #1d1e1f;
  font-size: 16px;
}

.expdate {
  color: #c91e1e;
  font-size: 14px;
}

.dmail {
  color: #4b7522;
  font-size: 14px;
  word-break: break-word;
}

.renewday {
  font-size: 15px;
  text-align: center;
  color: #1f1f1f;
  font-weight: 500;
}

.active {
  color: green;
  font-weight: bold;
}

.expired {
  color: red;
  font-weight: bold;
}
</style>
