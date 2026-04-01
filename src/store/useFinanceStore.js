import { create } from 'zustand';

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
let _n = 0;
export const uid = () => `tx_${++_n}`;

const INIT_TX = [
  { id: uid(), date: "2024-12-28", desc: "Monthly Salary",     cat: "Salary",        type: "income",  amt: 85000 },
  { id: uid(), date: "2024-12-27", desc: "Zomato Delivery",    cat: "Food & Dining", type: "expense", amt: 450   },
  { id: uid(), date: "2024-12-26", desc: "Electricity Bill",   cat: "Bills",         type: "expense", amt: 2100  },
  { id: uid(), date: "2024-12-25", desc: "Amazon Purchase",    cat: "Shopping",      type: "expense", amt: 3200  },
  { id: uid(), date: "2024-12-24", desc: "Ola Cab",            cat: "Transport",     type: "expense", amt: 180   },
  { id: uid(), date: "2024-12-23", desc: "Netflix",            cat: "Entertainment", type: "expense", amt: 649   },
  { id: uid(), date: "2024-12-22", desc: "Freelance Project",  cat: "Freelance",     type: "income",  amt: 15000 },
  { id: uid(), date: "2024-12-21", desc: "Pharmacy",           cat: "Healthcare",    type: "expense", amt: 850   },
  { id: uid(), date: "2024-12-20", desc: "Mutual Fund SIP",    cat: "Investment",    type: "expense", amt: 10000 },
  { id: uid(), date: "2024-12-19", desc: "Restaurant Dinner",  cat: "Food & Dining", type: "expense", amt: 1800  },
  { id: uid(), date: "2024-12-18", desc: "Metro Recharge",     cat: "Transport",     type: "expense", amt: 500   },
  { id: uid(), date: "2024-12-17", desc: "Mobile Recharge",    cat: "Bills",         type: "expense", amt: 399   },
  { id: uid(), date: "2024-12-15", desc: "Swiggy Orders",      cat: "Food & Dining", type: "expense", amt: 780   },
  { id: uid(), date: "2024-12-14", desc: "Movie Tickets",      cat: "Entertainment", type: "expense", amt: 1200  },
  { id: uid(), date: "2024-12-12", desc: "Gym Membership",     cat: "Healthcare",    type: "expense", amt: 2500  },
  { id: uid(), date: "2024-12-10", desc: "Dividend Income",    cat: "Investment",    type: "income",  amt: 3200  },
  { id: uid(), date: "2024-12-08", desc: "Flipkart Order",     cat: "Shopping",      type: "expense", amt: 5600  },
  { id: uid(), date: "2024-12-05", desc: "Petrol Fill",        cat: "Transport",     type: "expense", amt: 2000  },
  { id: uid(), date: "2024-12-03", desc: "Internet Bill",      cat: "Bills",         type: "expense", amt: 999   },
  { id: uid(), date: "2024-12-01", desc: "Coffee Shop",        cat: "Food & Dining", type: "expense", amt: 320   },
  { id: uid(), date: "2024-11-30", desc: "Monthly Salary",     cat: "Salary",        type: "income",  amt: 85000 },
  { id: uid(), date: "2024-11-28", desc: "Weekend Outing",     cat: "Entertainment", type: "expense", amt: 3500  },
  { id: uid(), date: "2024-11-25", desc: "Grocery Shopping",   cat: "Food & Dining", type: "expense", amt: 4200  },
  { id: uid(), date: "2024-11-22", desc: "Cab Fare",           cat: "Transport",     type: "expense", amt: 650   },
  { id: uid(), date: "2024-11-20", desc: "Freelance Work",     cat: "Freelance",     type: "income",  amt: 20000 },
  { id: uid(), date: "2024-11-18", desc: "Clothing Purchase",  cat: "Shopping",      type: "expense", amt: 4800  },
  { id: uid(), date: "2024-11-15", desc: "Doctor Visit",       cat: "Healthcare",    type: "expense", amt: 1500  },
  { id: uid(), date: "2024-11-12", desc: "Electricity Bill",   cat: "Bills",         type: "expense", amt: 1900  },
  { id: uid(), date: "2024-11-10", desc: "Mutual Fund SIP",    cat: "Investment",    type: "expense", amt: 10000 },
  { id: uid(), date: "2024-11-05", desc: "Books",              cat: "Entertainment", type: "expense", amt: 890   },
];

const useFinanceStore = create((set) => ({
  // State
  role: "viewer",
  tx: INIT_TX,
  tab: "dashboard",
  filters: { cat: "all", type: "all", search: "" },
  sort: { field: "date", dir: "desc" },
  form: { date: "", desc: "", cat: "Food & Dining", type: "expense", amt: "" },
  modal: false,

  // Actions
  setRole: (role) => set({ role }),
  setTab: (tab) => set({ tab }),
  setModal: (modal) => set({ modal }),
  
  // Accept either a new partial object or an updater function
  setFilters: (updater) => set((state) => ({ 
    filters: typeof updater === 'function' ? updater(state.filters) : { ...state.filters, ...updater }
  })),
  
  setSort: (updater) => set((state) => ({ 
    sort: typeof updater === 'function' ? updater(state.sort) : { ...state.sort, ...updater }
  })),
  
  setForm: (updater) => set((state) => ({ 
    form: typeof updater === 'function' ? updater(state.form) : { ...state.form, ...updater }
  })),

  addTx: () => set((state) => {
    const { form } = state;
    if (!form.date || !form.desc || !form.amt) return state; // Invalid form
    
    return {
      tx: [{ ...form, id: uid(), amt: parseFloat(form.amt) }, ...state.tx],
      form: { date: "", desc: "", cat: form.type === "income" ? "Salary" : "Food & Dining", type: form.type, amt: "" },
      modal: false
    };
  }),

  delTx: (id) => set((state) => ({
    tx: state.tx.filter(t => t.id !== id)
  })),

  toggleSort: (field) => set((state) => ({
    sort: state.sort.field === field 
      ? { ...state.sort, dir: state.sort.dir === "asc" ? "desc" : "asc" } 
      : { field, dir: "desc" }
  }))
}));

export default useFinanceStore;
