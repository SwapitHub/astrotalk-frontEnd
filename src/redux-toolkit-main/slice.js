const { createSlice, nanoid, current } = require("@reduxjs/toolkit");

// const initialState = {
//   chatStartStatus: JSON.parse(localStorage.getItem("emp")) || [],
// };

const Slice = createSlice({
  name: "addEmployeeSlice",
  chatStartTimeStatus: "addEmployeeSlice",
  initialState,
  reducers: {
    addChatStartStatus: (state, action) => {
      console.log(action);

      const data = {
        id: nanoid(),
        name: action.payload,
        chatStartTimeStatus: action.payload,
      };
      state.chatStartStatus.push(data);
      let empData = JSON.stringify(current(state.chatStartStatus));
      localStorage.setItem("emp", empData);
    },
    // removeEmployee: (state, action) => {
    //   state.employees = state.employees.filter(
    //     (item) => item.id !== action.payload
    //   );
    //   localStorage.setItem("emp", JSON.stringify(state.employees));
    // },
  },
});

export const { addChatStartStatus } = Slice.actions;
export default Slice.reducer;
