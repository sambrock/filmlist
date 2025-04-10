// import { create } from 'zustand';

// const types = { increase: 'INCREASE', decrease: 'DECREASE' };

// const reducer = (state, { type, by = 1 }) => {
//   switch (type) {
//     case types.increase:
//       return { grumpiness: state.grumpiness + by };
//     case types.decrease:
//       return { grumpiness: state.grumpiness - by };
//   }
// };

// export const useGlobalStore = create((set) => ({
//   grumpiness: 0,
//   dispatch: (args) => set((state) => reducer(state, args)),
// }));

