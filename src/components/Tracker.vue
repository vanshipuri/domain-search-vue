<script setup>
import { defineProps, defineEmits, watchEffect } from "vue";

const props = defineProps({
  tracked: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "untrackDomain",
  "updateEmail",
  "manualNotify",
  "updateNotifyDays",
]);

watchEffect(() => {
  props.tracked.forEach((item) => {
    if (!item.notifyDaysInput) {
      item.notifyDaysInput = (item.notifiedDays || []).join(",");
    }
  });
});

function confirmUntrack(domain) {
  emit("untrackDomain", domain);
}

function formatDate(dateString) {
  if (!dateString || dateString === "N/A") return "N/A";
  const dateOnly = new Date(dateString).toISOString().split("T")[0];
  return dateOnly;
}
</script>

<template>
  <div class="tracker-wrapper">
    <h3 class="tracker-title">Expiry Tracker</h3>
    <div class="responsive-table-wrapper">
      <table v-if="tracked.length" class="tracker-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Domain</th>
            <th>Email</th>
            <th>Notify Days</th>
            <th>Expiry</th>
            <th>Days Left</th>
            <th>Status</th>
            <th colspan="2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in tracked" :key="item.domain">
            <td>{{ idx + 1 }}</td>
            <td class="domain">{{ item.domain }}</td>
            <td>
              <input
                type="email"
                v-model="item.email"
                @change="
                  emit('updateEmail', {
                    domain: item.domain,
                    email: item.email,
                  })
                "
                placeholder="Enter email"
                class="input email-input"
              />
            </td>
            <td class="notify-cell">
              <input
                type="text"
                v-model="item.notifyDaysInput"
                @change="
                  emit('updateNotifyDays', {
                    domain: item.domain,
                    notifyDays: item.notifyDaysInput,
                  })
                "
                placeholder="e.g. 30,14,7"
                class="input notify-input"
              />
            </td>

            <td class="exp">{{ formatDate(item.expiryDate) }}</td>
            <td class="days-left">{{ item.daysLeft }}</td>
            <td :class="item.status === 'Expired' ? 'expired' : 'active'">
              {{ item.status }}
            </td>
            <td>
              <button class="btn untrack" @click="confirmUntrack(item.domain)">
                Untrack
              </button>
            </td>
            <td>
              <button class="btn notify" @click="emit('manualNotify', item)">
                Notify
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-msg">
        <em>No tracked domains.</em>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracker-wrapper {
  width: 95%;
  margin: 20px auto;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.082);
  overflow-x: auto;
}

.tracker-wrapper:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.233);
}

.tracker-title {
  font-size: 1.5rem;
  color: #4338ca;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.responsive-table-wrapper {
  overflow-x: auto;
  width: 100%;
}
.tracker-table {
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
  font-family: 'Segoe UI', sans-serif;
}
.tracker-table th, .tracker-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}
.tracker-table th {
  background-color: #ede9fe;
  color: #4f46e5;
  font-weight: bold;
}
.tracker-table td {
  font-size: 0.9rem;
}
.status-active {
  color: green;
  font-weight: bold;
}
.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}
.untrack-btn {
  background-color: #ef4444;
  color: white;
}
.notify-btn {
  background-color: #facc15;
  color: #1f2937;
}


/*.tracker-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  background-color: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
  min-width: 768px;
}

thead {
  background-color: #f3f4f6; /* Grey header */
  /*font-weight: 600;
  color: #374151;
  font-size: 0.8rem;
  text-transform: uppercase;
}

th,
td {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}
*/
td.domain {
  font-weight: 600;
  color: #1f2937;
  word-break: break-word;
}

td.exp {
  color: #c2410c;
  font-weight: 500;
}

td.days-left {
  color: #1e40af;
  font-weight: 500;
}
/* horizontal spacing specifically between Email and Notify cells */
.email-input {
  margin-right: 8px;
}

.notify-cell {
  padding-left: 8px;
}

.input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.8rem;
  background-color: #ffffff;
}

.input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.active {
  color: green;
  font-weight: bold;
}

.expired {
  color: red;
  font-weight: bold;
}

.btn {
  padding: 5px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.untrack {
  background-color: #ef4444;
  color: white;
}

.untrack:hover {
  background-color: #dc2626;
}

.notify {
  background-color: #facc15;
  color: #1f2937;
}

.notify:hover {
  background-color: #eab308;
}

.empty-msg {
  text-align: center;
  padding: 20px;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .tracker-wrapper {
    padding: 12px;
  }

  .tracker-title {
    font-size: 1.3rem;
  }

  .btn {
    margin: 2px 0;
    font-size: 0.7rem;
  }

  .input {
    font-size: 0.75rem;
    padding: 5px 7px;
  }
}
</style>
