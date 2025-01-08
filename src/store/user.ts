import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
  }),
  actions: {
    setUserId(id: number) {
      this.userId = id;
    },
  },
});
