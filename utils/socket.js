const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);

    socket.on("disconnect", () => {
      console.log("Client déconnecté :", socket.id);
    });
  });
};
export const emitOrderUpdate = (io, order) => {
  io.emit("order:update", order);
};

export default setupSocket;
