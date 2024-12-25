import { SyncLoader } from "react-spinners";
function Loader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <SyncLoader color="#516cf0" />
    </div>
  );
}

export default Loader;
