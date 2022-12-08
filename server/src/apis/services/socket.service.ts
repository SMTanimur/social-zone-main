let onlineUsers: any[] = [];

const addNewUser = (userId: string, socketId: string) => {
  !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
};
const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user?.socketId !== socketId);
};
const getUser = (userId: string) => {
  return onlineUsers.find((user) => user?.userId === userId);
};

const socketServices = {
  onlineUsers,
  addNewUser,
  removeUser,
  getUser,
};
export default socketServices;
